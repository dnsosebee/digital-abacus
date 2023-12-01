// src/Tiptap.jsx
import { EditorEvents, EditorProvider, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// just to style with min width and height
const CustomExtension = Extension.create({
  name: 'custom',
  defaultOptions: {
    HTMLAttributes: {},
  },
})

// define your extension array
const extensions = [
  StarterKit,
  CustomExtension,
]


export const Tiptap = ({updateJson, initialJson}: {updateJson: (json: any) => void, initialJson: any}) => {//{getJson}:{getJson: (json: string) => void}) => {

  const handleUpdate = (props: EditorEvents['update']) =>
  {
    const json = props.editor.getJSON()
    updateJson(json)
  }
  return (
    <EditorProvider extensions={extensions} content={initialJson} onUpdate={handleUpdate} >
      {/* <FloatingMenu>This is the floating menu</FloatingMenu>
      <BubbleMenu>This is the bubble menu</BubbleMenu> */}
    </EditorProvider>
  )
}