import env from '#start/env'
import { fullName } from './custom_functions.js'
import User from '#models/user'
import sgMail from '@sendgrid/mail'
import { sendEmail } from './sendMailService.js'
sgMail.setApiKey(env.get('SENDGRID_API_KEY2', ''))

export const emailTemplate = (url: string, title: string, message: string, btnText: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style>
        /* Add your custom CSS styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .buttontext{
            color:white ;
            font-weight:600 ;
            
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <p>${message}</p>
        <a class="button" href=${url}> <span class="buttontext"> ${btnText} </span> </a>
        <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
        <p>${url}</p>
        <p>Best regards,<br> MES Team</p>
    </div>
</body>
</html>
`
export const supportEmailTemplate = (
  name: string,
  phoneNumber: string,
  message: string,
  userEmail: string,
  terceroClientId: string
) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Support Message</title>
      <style>
          /* Add your custom CSS styles here */
          body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
          }
          p {
              color: #666666;
              margin-bottom: 10px;
              line-height: 1.5;
          }
          .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .contact-link {
              color: #007bff;
              text-decoration: none;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Support Message</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Tercero Client Id:</strong> ${terceroClientId}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p>If you need further assistance, you can contact the user by emailing them at <a class="contact-link" href="mailto:${userEmail}">${userEmail}</a>.</p>
          <p>Best regards,<br> MES Support Team</p>
      </div>
  </body>
  </html>
  `

export const submitFxRequestEmailTemplate = (
  userName: string,
  fromCashAccountId: string,
  toCashAccountId: string,
  amount: string,
  fromCurrency: string,
  toCurrency: string,
  orderType: string,
  desiredOrderRate: number
) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FX Request Details</title>
        <style>
            /* Add your custom CSS styles here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333333;
                font-size: 24px;
                margin-bottom: 20px;
            }
            p {
                color: #666666;
                margin-bottom: 10px;
                line-height: 1.5;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .contact-link {
                color: #007bff;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>FX Request Details</h1>
            <p><strong>User Name</strong>${userName}</p>
            <p><strong>From Cash Account ID:</strong> ${fromCashAccountId}</p>
            <p><strong>To Cash Account ID:</strong> ${toCashAccountId}</p>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>From Currency:</strong> ${fromCurrency}</p>
            <p><strong>To Currency:</strong> ${toCurrency}</p>
            <p><strong>Order Type:</strong> ${orderType}</p>
            ${orderType && `<p><strong>Order Type:</strong> ${orderType}</p>`} 
            ${desiredOrderRate && `<p><strong>Desire Order Rate:</strong> ${desiredOrderRate}</p>`} 
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br> FX Support Team</p>
        </div>
    </body>
    </html>
    `

export const documentEmailTemplate = (
  name: string,
  phoneNumber: string,
  userEmail: string,
  title: string,
  terceroClientId: string
) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                /* Add your custom CSS styles here */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333333;
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                p {
                    color: #666666;
                    margin-bottom: 10px;
                    line-height: 1.5;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #0056b3;
                }
                .contact-link {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${title}</h1>
                <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Tercero Client Id:</strong> ${terceroClientId}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
                <p>If you need further assistance, you can contact the user by emailing them at <a class="contact-link" href="mailto:${userEmail}">${userEmail}</a>.</p>
                <p>Best regards,<br> MES Support Team</p>
            </div>
        </body>
        </html>
        `

export const sendUserAddressChangesToAdmin = (user: any, data: any) => {
  const fieldsToCheck = {
    country: 'Country',
    addressLine1: 'Address1',
    addressLine2: 'Address2',
    addressLine3: 'Address3',
    addressLine4: 'Address4',
    zipCode: 'PostCode',
  }

  const changes = []

  for (const [userField, dataField] of Object.entries(fieldsToCheck)) {
    if (data[dataField] && data[dataField] !== user[userField]) {
      changes.push({
        field: userField,
        from: user[userField] || 'N/A', // In case of null or undefined values
        to: data[dataField],
      })
    }
  }

  const msg: any = {
    personalizations: [
      {
        to: env.get('SUPPORT_MAIL'),
        dynamic_template_data: {
          name: fullName(user),
          tercero_client_id: user?.terceroClientId,
          platinum_member_id: user?.plataniumMemberId,
          changes: changes,
        },
      },
    ],
    from: { email: env.get('FROM_MAIL2', ''), name: 'MES Pensions' },
    templateId: env.get('EMAIL_PROFILE_CHANGES_TEMPLATE'),
  }

  sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error)

      if (error.response) {
        console.error(error.response.body)
      }
    }
  )

  return changes
}

export const sendContributionDetailsToAdmin = (user: User, data: any) => {
  sendEmail({
    to: env.get('SUPPORT_MAIL', ''),
    from: { email: env.get('FROM_MAIL2', ''), name: 'MES Pensions' },
    templateId: env.get('CLIENT_CONTRIBUTION_TEMPLATE_ID', ''),
    dynamicTemplateData: {
      name: fullName(user),
      tercero_client_id: user?.terceroClientId,
      platinum_member_id: user?.plataniumMemberId,
      contribution_currency: data.contributionCurrency,
      contribution_amount: data.contributionAmount,
      employment_status: data.employmentStatus,
      funding_resource: data.fundingResource?.join(', '),
      contribute_reclaim_taxRelief: data.contributeReclaimTaxRelief,
    },
  })
}
