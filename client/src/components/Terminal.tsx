import { Terminal as XTerminal } from "@xterm/xterm";
import '@xterm/xterm/css/xterm.css';
import socket from "../socket";
import { useEffect, useRef } from "react";

const Terminal = () =>{
    const terminalRef = useRef<any>();
    const isRendered = useRef<any>(false);

    useEffect(()=>{
        if(isRendered.current) return;
        isRendered.current = true;
        
        const terminal = new XTerminal({
            rows: 20,
        });
        terminal.open(terminalRef.current);

        terminal.onData((data)=>{
            socket.emit('terminal:input', data);
        });

        socket.on('terminal:output', (data)=>{
            terminal.write(data);
        })
    })
    return (
        <div ref={terminalRef} id="terminal"></div>
    )
};

export default Terminal;