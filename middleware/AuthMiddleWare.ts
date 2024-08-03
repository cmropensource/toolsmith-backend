const jwt = require("jsonwebtoken")
export const AuthWare = async (req : any, res : any , next : any) => {
    try {
        const token = await req.header("Authorization");
        if(!token){
            return res.status(401).json({message : "Access Denied"})
        }
        const secret : string = process.env.JWT_SECRET || "";
        if(secret == ""){
            return res.status(500).json({message : "Internal Server Error"})
        }
        const decoded = await jwt.verify(token , secret);
        if(!decoded){
            return res.status(401).json({message : "Access Denied"})
        }
        else next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}