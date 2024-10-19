import {Resend} from "resend";

export const sendEmail = async (fromAddr: string, toAddr: string[], subject: string, html: string) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY as string
    const resend = new Resend(RESEND_API_KEY);
    const {data, error} = await resend.emails.send({
        from: fromAddr,
        to: toAddr,
        subject: subject,
        html: html
    });
    return {data, error}
}
