import {jwtDecode} from 'jwt-decode';


export function isTokenExpired(token: string): boolean {
    try{
        const decoded:any = jwtDecode(token)
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }catch(error){
        console.error('Error decoding token:', error);
        return true; 
    }
}