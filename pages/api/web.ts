import axios from 'axios';
import * as https from "https";

export default function handler(req: any, res: any) {
    const body: any = JSON.parse(req.body);

    console.log(body);

    if (!body.URL) {
        return;
    }

    axios.get(body.URL, {
        httpsAgent: new https.Agent({

            rejectUnauthorized: false
        })
    })
        .then(response => {
            res.status(200).json({ html: response.data });
        })
        .catch(error => {
            console.error(error);
        });
}