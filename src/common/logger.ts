import debug from "debug";
export default function (namespace: string) {
    const debugLog: debug.IDebugger = debug(namespace);
    return debugLog
}