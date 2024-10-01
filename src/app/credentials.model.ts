export interface Credentials {
    captcha_code: string;
    captcha_type: 'recaptcha' | 'friendly_captcha';
    email_address: string;
    raw_password: string;
}
