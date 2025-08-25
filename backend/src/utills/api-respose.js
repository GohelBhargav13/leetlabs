class ApiResponse {
    constructor(StatusCode,data,Message,success=true){
        this.StatusCode = StatusCode
        this.data = data
        this.Message = Message
        this.success = success
    }
}

export { ApiResponse }