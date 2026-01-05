import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Unimate Setup Complete</h1>
        <p className="mb-4 text-gray-600">Tailwind + shadcn/ui running.</p>
        <Button onClick={() => alert("It works!")}>Click Me</Button>
      </div>
    </div>
  )
}

export default App
