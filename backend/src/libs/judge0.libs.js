import axios from "axios"

export const getjudge0LanguageId = (language) => {

    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63
    }

    return languageMap[language.toUpperCase()]

}

const sleep = (ms) => new Promise((reolve) => setTimeout(reolve,ms))

export const pollBatchResults = async(tokens) => {
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false
            }
        })

        const result = data.submissions;

        const isAlldone = result.every((r) =>  r.status_id !== 1 && r.status_id !== 2)

        if(isAlldone) return result
        await sleep(1000)
    }
}

export const submitBatch = async(submisions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submisions
    })

    console.log("submission data : ", data);
    return data
}