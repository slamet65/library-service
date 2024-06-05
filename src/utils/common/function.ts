export class Function {
    isnull(value: any) {
        if (value == undefined || value == null || value === "" || value === "null") return true
        else return false
    }
}