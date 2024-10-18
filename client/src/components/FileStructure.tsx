import React, { useState } from 'react';
import {
    FaFolder,
    FaFolderOpen,
    FaFile,
    FaChevronRight,
    FaChevronDown,
    FaJava,
} from 'react-icons/fa';
import {
    SiJavascript,
    SiTypescript,
    SiCss3,
    SiHtml5,
    SiReact,
    SiJson,
    SiMarkdown,
    SiNodedotjs,
    SiPython,
    SiPhp,
    SiCsharp,
} from 'react-icons/si';
import {
    BsFilePdf,
    BsFileImage,
    BsFileBinary,
} from 'react-icons/bs';

const getFileIcon = (fileName: string) =>{
    const extension = fileName.split('.').pop()?.toLocaleLowerCase();

    switch (extension) {
        case 'js':
          return <SiJavascript className="text-yellow-500" />;
        case 'ts':
          return <SiTypescript className="text-blue-500" />;
        case 'css':
          return <SiCss3 className="text-blue-400" />;
        case 'html':
          return <SiHtml5 className="text-orange-500" />;
        case 'json':
          return <SiJson className="text-green-600" />;
        case 'md':
          return <SiMarkdown className="text-gray-500" />;
        case 'jsx':
        case 'tsx':
          return <SiReact className="text-cyan-400" />;
        case 'node':
          return <SiNodedotjs className="text-green-500" />;
        case 'py':
          return <SiPython className="text-blue-600" />;
        case 'php':
          return <SiPhp className="text-indigo-500" />;
        case 'java':
          return <FaJava className="text-red-500" />;
        case 'cs':
          return <SiCsharp className="text-purple-500" />;
        case 'pdf':
          return <BsFilePdf className="text-red-500" />;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
          return <BsFileImage className="text-pink-500" />;
        case 'exe':
        case 'bin':
          return <BsFileBinary className="text-gray-700" />;
        default:
          return <FaFile className="text-gray-400" />;
    };
};

interface FileTreeNodeProps{
    fileName: String;
    nodes?: {[key: string]: any} | null;
    isRoot?: boolean;
};

const FileTreeNode: React.FC<FileTreeNodeProps> = ({fileName, nodes, isRoot=false}) =>{
    const [isOpen, setIsOpen] = useState(isRoot);

    const isFolder = nodes && typeof nodes === 'object';
    const hasChildren = isFolder && Object.keys(nodes).length > 0;

    const toggleOpen = () => {
        if(isFolder) setIsOpen(!isOpen);
    };

    return (
        <div className='ml-2'>
            <div className={`cursor-pointer flex items-center space-x-2 p-2 rounded-lg transition-all`} onClick={toggleOpen}>
                {isFolder && (
                    <span>{isOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                )} 

                {isFolder ? (
                    isOpen ? (
                        <FaFolderOpen className='text-yellow-400' />
                    ) : (
                        <FaFolder className='text-yellow-400' />
                    )
                ) : (
                    getFileIcon(fileName as string)
                )}

                <span className={`${isFolder ? 'font-medium' : 'font-normal'} text-gray-700`}>{fileName}</span>
            </div>

            {isOpen && hasChildren && (
                <ul className='ml-6 pl-2 border-l-2 border-gray-200'>
                    {Object.keys(nodes!).map((child)=>{
                        return (
                            <li key={child}>
                                <FileTreeNode fileName={child} nodes={nodes![child]} />
                            </li>
                        )
                    })}
                </ul>
            )}

            {isOpen && isFolder && !hasChildren && (
                <div className='ml-6 pl-2 text-gray-500 italic'>Empy Folder</div>
            )}
        </div>
    )
};

interface FileTreeProps{
    tree: {[key: string]: any};
}

const FileTree: React.FC<FileTreeProps> = ({ tree }) => {
    return <FileTreeNode fileName='/' nodes={tree} isRoot={true} />
}

export default FileTree;