import {
  dialogflow,
  DialogflowConversation
} from 'actions-on-google'
import { https } from 'firebase-functions'

import { sendMessage } from './slack'
import { wordMap } from './words'

const app = dialogflow({
  debug: true,
})

app.intent('Word', async(conv: DialogflowConversation) => {
  const { word } = conv.parameters
  if (typeof word !== 'string') {
    conv.close('障害が発生中です。時間をおいて利用してください。')
    console.log(word)
    sendMessage(`不正なパラメータが渡されました。type: \`${typeof word}\``)

    return
  }

  if (!(word in wordMap)) {
    // TODO: slackに通知する
    conv.ask(`すいません、「${word}」はわかりませんでした。`)
    conv.ask('他に知りたい単語をどうぞ。')
    sendMessage(`データにだけ存在しないワードが渡されました: \`${word}\``)

    return
  }

  conv.ask(wordMap[word])
  conv.ask('他に知りたい単語をどうぞ。')
})

app.intent('Fallback', async(conv: DialogflowConversation) => {
  conv.ask(`すいません、「${conv.query}」はわかりませんでした。`)
  conv.ask('他に知りたい単語をどうぞ。')
  sendMessage(`知らない単語が渡されました: \n\`\`\`\n${conv.query}\n\`\`\``)
})

exports.fulfillment = https.onRequest(app)
