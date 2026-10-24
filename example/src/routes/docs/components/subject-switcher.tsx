import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { ComponentDoc } from "@/hoogin/docs/doc-page"
import { DocSection } from "@/hoogin/docs/doc-section"
import { CodeBlock } from "@/hoogin/docs/code-block"
import { Preview } from "@/hoogin/docs/preview"
import { PropsTable } from "@/hoogin/docs/props-table"
import {
  SubjectSwitcher,
  type SubjectOption,
} from "@/hoogin/ui/navigation/subject-switcher"

export const Route = createFileRoute("/docs/components/subject-switcher")({
  component: SubjectSwitcherPage,
})

const subjects: SubjectOption[] = [
  { name: "ACME Corporation" },
  { name: "Beta Industries" },
  { name: "Globex" },
  { name: "Initech" },
  { name: "Umbrella" },
]

function SwitcherDemo({ subjectList }: { subjectList: SubjectOption[] }) {
  const [value, setValue] = useState(subjectList[0]?.name)
  return (
    <div className="w-64 rounded-lg border bg-background p-1 shadow-xs">
      <SubjectSwitcher
        title="Subject"
        subjects={subjectList}
        value={value}
        onSelect={(subject) => setValue(subject.name)}
      />
    </div>
  )
}

function SubjectSwitcherPage() {
  return (
    <ComponentDoc name="subject-switcher">
      <DocSection title="Preview">
        <Preview className="flex flex-col items-center gap-3">
          <SwitcherDemo subjectList={subjects} />
          <p className="text-xs text-muted-foreground">
            With a single subject the trigger is rendered statically:
          </p>
          <SwitcherDemo subjectList={[{ name: "Initech" }]} />
        </Preview>
      </DocSection>
      <DocSection title="Usage">
        <CodeBlock
          language="tsx"
          code={`import { SubjectSwitcher } from "@/hoogin/ui/navigation/subject-switcher"

<SubjectSwitcher
  title="Subject"
  subjects={subjects}
  value={selected?.name}
  onSelect={(subject) => setSelected(subject)}
/>

// The selection is controlled. To restore the last selection on reload,
// persist it yourself, e.g. with localStorage:
const [selected, setSelected] = useState<SubjectOption | undefined>(
  () =>
    subjects.find((s) => s.name === localStorage.getItem("mySubject")) ??
    subjects[0]
)
function selectSubject(subject: SubjectOption) {
  setSelected(subject)
  localStorage.setItem("mySubject", subject.name)
}`}
        />
      </DocSection>
      <DocSection title="Props">
        <PropsTable
          rows={[
            {
              prop: "title",
              type: "string",
              description: "Required. First line, describes the subject kind.",
            },
            {
              prop: "subjects",
              type: "SubjectOption[]",
              description:
                "Required. The selectable subjects; each option is one subject.",
            },
            {
              prop: "value",
              type: "string | undefined",
              default: "subjects[0]",
              description: "Name of the selected subject (controlled).",
            },
            {
              prop: "onSelect",
              type: "(subject: SubjectOption) => void",
              description: "Called with the picked subject. Persist it here.",
            },
          ]}
        />
      </DocSection>
    </ComponentDoc>
  )
}
