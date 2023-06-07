import { Configuration, EmailMessageData, EmailsApi } from "@elasticemail/elasticemail-client-ts-axios";
import { User } from "src/modules/user/entities/user.entity";



const config = new Configuration({
    apiKey:
      '235DDC46D489FBDC25AE0CBF53F4525BC996002BFC60BD37970D72D92F3156B39C92D3006B5CEB79478A217B16EB97F',
  });
  
  const emailsApi = new EmailsApi(config);
  
  export function welcome(user: User, message, subject) {
    const emailMessageData: EmailMessageData = {
      Recipients: [
        {
          Email: `${user.email}`,
          Fields: {
            name: `${user.firstName}`,
          },
        },
      ],
      Content: {
        Body: [
          {
            ContentType: 'PlainText',
            Charset: 'utf-8',
            Content: `Hi {name}! ${message}`,
          },
        ],
        From: 'abiodunraheem23@gmail.com',
        Subject: `${subject}`,
      },
    };
    emailsApi
      .emailsPost(emailMessageData)
      .then((response) => {
        console.log('Api called successfully');
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }