using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace ProjectManagementApp.Services
{
    public class SmsService
    {
        private readonly IConfiguration _config;

        public SmsService(IConfiguration config)
        {
            _config = config;
            TwilioClient.Init(
                _config["Twilio:AccountSID"],
                _config["Twilio:AuthToken"]);
        }

        public void SendSms(string to, string body)
        {
            MessageResource.Create(
                body: body,
                from: new Twilio.Types.PhoneNumber(_config["Twilio:FromNumber"]),
                to: new Twilio.Types.PhoneNumber(to)
            );
        }
    }
}
