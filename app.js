class App {
    constructor() {
        this.notes = []

        this.$placeholder = document.querySelector("#placeholder")
        this.$notes = document.querySelector("#notes")
        this.$form = document.querySelector("#form")
        this.$noteTitle = document.querySelector("#note-title")
        this.$noteText = document.querySelector("#note-text")
        this.$formButtons = document.querySelector("#form-buttons")
        this.$formCloseButton = document.querySelector("#form-close-button")

        this.addEventListeners()
    }

    addEventListeners() {
        document.body.addEventListener("click", event => {
            this.handleFormClick(event)
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
    }

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

    addNote({ title, text }) {
        const newNote = {
            title,
            text,
            color: "white",
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
        }

        this.notes = [...this.notes, newNote]
        this.displayNotes()
        this.closeForm()
    }

    displayNotes() {
        const hasNotes = this.notes.length > 0

        this.$placeholder.style.display = hasNotes ? "none" : "flex"

        // REFACTOR WITH CREATE ELEMENT
        this.$notes.innerHTML = this.notes.map(note => {
            return `
            <div style="background: ${note.color};" class="note">
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                <div class="toolbar">
                    <img class="toolbar-color" src="">
                    <img class="toolbar-delete" src="">
                </div>
                </div>
            </div>
            `
        }).join("")
    }

    clearFormFields() {
        this.$noteTitle.value = ""
        this.$noteText.value = ""
    }
}

new App()