const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'marin.dedic1308@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome ${name}, later there will be punishment`
    })
}

const sendCancelationEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'marin.dedic1308@gmail.com',
        subject: 'GG m8 it was fun',
        text: `Goodbye ${name}, it was fun while it lasted. Time flies quick huh?`,
        html: '<h1>:(</h1>'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}