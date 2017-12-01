import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Event } from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';
import * as moment from 'moment';

admin.initializeApp(functions.config().firebase);

export const modifyChatMessage = functions.database
  .ref('chat/friend_list/{roomId}/{messageId}')
  .onCreate(
    (event: Event<DeltaSnapshot>) => {
      const currentUser = (event as any).auth.variable;
      console.log('currentUser', currentUser);

      const adminRef = admin.database();

      const params = event.params;
      console.log('params', params);

      const data = event.data.val();
      console.log('data', data);
      data.msg = `előben: ${data.msg}`;
      data.created = moment().unix();

      return event.data.ref.set(data)
        .then(
          () => adminRef.ref('/logs/chat/valami').push({ id: '....' })
        )
        .then();
    }
  );
