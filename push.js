const webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BIM_I6uR9U_5-uyooscxmiwMy__CwFrwIp5ySy-wSMf11g9ykGn97dcM5VtZtCHsd-IMqSA1iLz4XEauWN5xa6Y",
  privateKey: "Sc2US0hkcLr1_ggQDs9lxhz7rAWOG7UboIMFIcA03O4",
};

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
const pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/cmexansrTu4:APA91bEs09H0XQUBnVFgAA1YeFxV4Td1MdesthGBZjLZrjGkwX19N4ZcK7xySU2qWLG3TtHhkwnlQEIYNUSODWHI3AR5J-1hLyQqwQ3fM3jIBsHL4K3YbyRCtQvJUvO0WtWBNOiNKFW3",
  keys: {
    p256dh:
      "BKN1gek2eb0llXUdX7V5Q8LOrv1IbWUrIr5ikp4RviIVmKx2r/94atcnhZ9RZUD5BtGJWQkPWXuWzm5TMIpayHg=",
    auth: "okCVgccJNKrRtbXES9sXcQ==",
  },
};
const payload = "Open Your InFootball App now, Read your Favorite Teams";

const options = {
  gcmAPIKey: "1035187836516",
  TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
