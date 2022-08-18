class WorkerManager {
    constructor(workerURL, standardIO) {
        this.workerURL = workerURL
        this.standardIO = standardIO
        this.worker = null
        this.stdinbuffer = null
        this.stdinbufferInt = 0
        this.resolveWorkerReady = null
        this.ready = null
        this.initialiseWorker()
    }

    async initialiseWorker() {
        this.ready = new Promise((resolve) => {
            this.resolveWorkerReady = resolve
        })
        if (!this.worker) {
            this.worker = new Worker(this.workerURL)
            this.worker.addEventListener('message', this.handleMessageFromWorker)
        }
    }

    async runCode(params) {
        await this.ready
        this.stdinbuffer = new SharedArrayBuffer(100 * Int32Array.BYTES_PER_ELEMENT)
        this.stdinbufferInt = new Int32Array(this.stdinbuffer)
        this.stdinbufferInt[0] = -1
        this.worker.postMessage({
            type: 'run',
            buffer: this.stdinbuffer,
            params
        })
    }

    handleStdinData(inputValue) {
        if (this.stdinbuffer && this.stdinbufferInt) {
            let startingIndex = 1
            if (this.stdinbufferInt[0] > 0) {
                startingIndex = this.stdinbufferInt[0]
            }
            const data = new TextEncoder().encode(inputValue)

            data.forEach((value, index) => {
                this.stdinbufferInt[startingIndex + index] = value
            })
    
            this.stdinbufferInt[0] = startingIndex + data.length - 1
            Atomics.notify(this.stdinbufferInt, 0, 1)
        }
    }

    handleMessageFromWorker = (event) => {
        const type = event.data.type
        if (type === 'ready') {
            this.resolveWorkerReady(true)
        } else if (type === 'stdout') {
            this.standardIO.stdout(event.data.stdout)
        } else if (type === 'stderr') {
            this.standardIO.stderr(event.data.stderr)
        } else if (type === 'stdin') {
            // Leave it to the terminal to decide whether to chunk it into lines
            // or send characters depending on the use case.
            this.standardIO.stdin().then((inputValue) => {
                this.handleStdinData(inputValue)
            })
        }
      }

}

export default WorkerManager