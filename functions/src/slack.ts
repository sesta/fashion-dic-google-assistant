import { config } from 'firebase-functions'
import * as request from 'request'

export function sendMessage(text: string): void {
  const options = {
    json: {
      text
    },
    uri: config().slack.url
  }

  request.post(options)
}
