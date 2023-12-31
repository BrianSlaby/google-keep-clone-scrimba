class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem("notes")) || []
        this.title = ""
        this.text = ""
        this.id = ""

        this.$placeholder = document.querySelector("#placeholder")
        this.$notes = document.querySelector("#notes")
        this.$form = document.querySelector("#form")
        this.$noteTitle = document.querySelector("#note-title")
        this.$noteText = document.querySelector("#note-text")
        this.$formButtons = document.querySelector("#form-buttons")
        this.$formCloseButton = document.querySelector("#form-close-button")
        this.$modal = document.querySelector(".modal")
        this.$modalTitle = document.querySelector(".modal-title")
        this.$modalText = document.querySelector(".modal-text")
        this.$modalCloseButton = document.querySelector(".modal-close-button")
        this.$colorTooltip = document.querySelector("#color-tooltip")

        this.render()
        this.addEventListeners()
    }

// ============================================
//            EVENT LISTENERS
// ============================================

    addEventListeners() {
        document.body.addEventListener("click", event => {
            this.handleFormClick(event)
            this.selectNote(event)
            this.openModal(event)
            this.deleteNote(event)
        })
        
        document.body.addEventListener("mouseover", event => {
            this.openTooltip(event)
        })

        document.body.addEventListener("mouseout", event => {
            this.closeTooltip(event)
        })

        this.$colorTooltip.addEventListener("mouseover", function() {
            this.style.display = "flex"
        })

        this.$colorTooltip.addEventListener("mouseout", function() {
            this.style.display = "none"
        })

        this.$colorTooltip.addEventListener("click", event => {
            const color = event.target.dataset.color
            if (color) {
                this.editNoteColor(color)
            }
        })

        this.$form.addEventListener("submit", event => {
            event.preventDefault()
            const title = this.$noteTitle.value
            const text = this.$noteText.value

            if (title || text) {
                this.addNote({ title, text })
            }

        })

        this.$formCloseButton.addEventListener("click", event => {
            event.stopPropagation()
            this.closeForm()
        })

        this.$modalCloseButton.addEventListener("click", event => {
            this.closeModal(event)
        })
    }

// ============================================
//                UI METHODS
// ============================================

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target)

        const title = this.$noteTitle.value
        const text = this.$noteText.value

        if (isFormClicked) {
            this.openForm()
        } else if (title || text) {
            this.addNote({ title, text })
        } else {
            this.closeForm()
        }
    }

    openForm() {
        this.$form.classList.add("form-open")
        this.$noteTitle.style.display = "block"
        this.$formButtons.style.display = "block"
    }

    closeForm() {
        this.$form.classList.remove("form-open")
        this.$noteTitle.style.display = "none"
        this.$formButtons.style.display = "none"
        this.clearFormFields()
    }

    openModal(event) {
        if (event.target.matches(".toolbar-delete")) return
        if (event.target.closest(".note")) {
            this.$modal.classList.toggle("open-modal")
            this.$modalTitle.value = this.title
            this.$modalText.value = this.text
        }
    }

    closeModal(event) {
        this.editNote()
        this.$modal.classList.toggle("open-modal")
    }

    openTooltip(event) {
        if (!event.target.matches(".toolbar-color")) return
        this.id = event.target.dataset.id
        const noteCoords = event.target.getBoundingClientRect()
        const horizontal = noteCoords.left + window.scrollX
        const vertical = window.scrollY - 25
        this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`
        this.$colorTooltip.style.display = "flex"
    }

    closeTooltip(event) {
        if (!event.target.matches(".toolbar-color")) return
        this.$colorTooltip.style.display = "none"
    }

// ============================================
//           NOTE SPECIFIC METHODS
// ============================================

    addNote({ title, text }) {
        const newNote = {
            title,
            text,
            color: "white",
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        }

        this.notes = [...this.notes, newNote]
        this.render()
        this.closeForm()
    }

    editNote() {
        const title = this.$modalTitle.value
        const text = this.$modalText.value
        this.notes = this.notes.map(note => {
            if (note.id === Number(this.id)) {
                return { ... note, title, text }
            } else {
                return note
            }
        })
        this.render()
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note => {
            if (note.id === Number(this.id)) {
                return { ... note, color }
            } else {
                return note
            }
        })
        this.render()
    }

    selectNote(event) {
        const $selectedNote = event.target.closest(".note")
        if (!$selectedNote) return
        const [ $noteTitle, $noteText ] = $selectedNote.children
        this.title = $noteTitle.innerText
        this.text = $noteText.innerText
        this.id = $selectedNote.dataset.id
    }

    deleteNote(event) {
        event.stopPropagation()
        if (!event.target.matches(".toolbar-delete")) return
        const id = event.target.dataset.id
        this.notes = this.notes.filter(note => note.id !== Number(id))
        this.render()
    }

    render() {
        this.saveNotes()
        this.displayNotes()
    }

    saveNotes() {
        localStorage.setItem("notes", JSON.stringify(this.notes))
    }

// ============================================
//         CREATE ELEMENT METHODS
// ============================================

    createToolbarColor(note) {
        const icon = document.createElement("img")
        icon.src = `assets/palette-solid.svg`
        icon.classList.add("toolbar-color")
        icon.dataset.id = note.id

        return icon
    }

    createToolbarDelete(note) {
        const icon = document.createElement("img")
        icon.src = `assets/trash-solid.svg`
        icon.classList.add("toolbar-delete")
        icon.dataset.id = note.id

        return icon
    }

    createToolbar(note) {
        const toolbar = document.createElement("div")
        toolbar.classList.add("toolbar")
        toolbar.appendChild(this.createToolbarColor(note))
        toolbar.appendChild(this.createToolbarDelete(note))

        return toolbar
    }

    createToolbarContainer(note) {
        const container = document.createElement("div")
        container.classList.add("toolbar-container")
        container.appendChild(this.createToolbar(note))

        return container
    }

    createNoteTitle(note) {
        const noteTitle = document.createElement("div")
        noteTitle.classList.add(`${note.title && 'note-title'}`)
        noteTitle.textContent = note.title

        return noteTitle
    }

    createNoteText(note) {
        const noteText = document.createElement("div")
        noteText.classList.add("note-text")
        noteText.textContent = note.text

        return noteText
    }

    createNoteEl(note) {
        const noteEl = document.createElement("div")
        noteEl.classList.add("note")
        noteEl.dataset.id = note.id
        noteEl.style.background = note.color
        noteEl.appendChild(this.createNoteTitle(note))
        noteEl.appendChild(this.createNoteText(note))
        noteEl.appendChild(this.createToolbarContainer(note))

        return noteEl
    }

// ============================================
//       displayNotes uses above methods
// ============================================

    displayNotes() {
        const hasNotes = this.notes.length > 0

        this.$placeholder.style.display = hasNotes ? "none" : "flex"

        const notesHTML = this.notes.map(note => this.createNoteEl(note))
        this.$notes.innerHTML = ''
        this.$notes.append(...notesHTML)
    }

    clearFormFields() {
        this.$noteTitle.value = ""
        this.$noteText.value = ""
    }
}

new App()