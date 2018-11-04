import {
  dialogflow,
  DialogflowConversation
} from 'actions-on-google'
import { https } from 'firebase-functions'

import { wordMap } from './words'

const app = dialogflow({
  debug: true,
})

app.intent('Word', async(conv: DialogflowConversation) => {
  const { word } = conv.parameters
  if (typeof word !== 'string') {
    conv.close('障害が発生中です。時間をおいて利用してください。')

    return
  }

  if (!(word in wordMap)) {
    // TODO: slackに通知する
    conv.ask(`すいません、「${word}」はわかりませんでした。`)
    conv.ask('他に知りたい単語をどうぞ。')

    return
  }

  conv.ask(wordMap[word])
  conv.ask('他に知りたい単語をどうぞ。')
})

app.intent('Fallback', async(conv: DialogflowConversation) => {
  // TODO: slackに通知する
  conv.ask(`すいません、「${conv.query}」はわかりませんでした。`)
  conv.ask('他に知りたい単語をどうぞ。')
})

exports.fulfillment = https.onRequest(app)
