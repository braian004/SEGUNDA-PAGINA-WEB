const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { google } = require("googleapis")
require('dotenv').config()

router.post('/', (req, res) => {

    const {name, email, phone, message} = req.body
    const HTMLContent = `
        <div align='center'>
            <h1>Hola Santiago, mi nombre es ${name} y quiero contactarte...</h1>
            <h2>${message}</h2>
            <h3>Mi información de contacto es:</h3>
            <h3>Email: ${email}</h3>
            <h3>Número de celular: ${phone}</h3>
        </div>
    `

    const CLIENT_ID = process.env.CLIENT_ID
    const CLIENT_SECRET = process.env.CLIENT_SECRET
    const REDIRECT_URI = process.env.REDIRECT_URI
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

    async function sendEmail(){

        const accessToken = await oAuth2Client.getAccessToken()

        try{

            const transporter = nodemailer.createTransport({

                service: "gmail",
                auth:{
                    type: 'OAuth2',
                    user: 'santiagopujanatech@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken

                }
            })

            const mail_options = {

                from: "Mi Portafolio Web <santiagopujanatech@gmail.com>",
                to: "santiagopujana@gmail.com",
                subject: 'Quiero contactarte',
                html: HTMLContent
            }

            const result = await transporter.sendMail(mail_options)
            return result

        }catch(err){
            console.log(err)
        }
    }

    sendEmail()
        .then(result => res.json())
        .catch((err) => console.log(err.message))
})

module.exports = router