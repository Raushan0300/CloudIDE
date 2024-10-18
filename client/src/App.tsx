import { useEffect, useState } from "react"
import FileTree from "./components/FileStructure"
import Terminal from "./components/Terminal"

function App() {
  const [fileTree, setFileTree] = useState<any>({});

  const getFileStructure = async()=>{
    const res = await fetch('http://localhost:3000/files');
    const data = await res.json();
    setFileTree(data);
  };

  useEffect(()=>{
    getFileStructure();
  },[])

  return (
    <div className="flex flex-col">
      <div className="min-h-[60vh] flex">
        <div>
          <FileTree tree={fileTree} />
        </div>
        <div></div>
      </div>
      <div>
      <Terminal />
      </div>
    </div>
  )
}

export default App
