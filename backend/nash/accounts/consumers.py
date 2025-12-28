import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import ChatMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message_id = data.get("id")
        content = data.get("message")   # frontend sends "message"
        sender = data.get("sender")

        if not content or not sender:
            return  # prevent crash

        # ✅ SAVE CORRECTLY
        await sync_to_async(ChatMessage.objects.create)(
            room=self.room_name,
            sender=sender,
            content=content
        )

        # ✅ BROADCAST
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": message_id,
                "message": content,
                "sender": sender,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))
