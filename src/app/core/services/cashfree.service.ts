// src/app/services/cashfree.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

@Injectable({
    providedIn: 'root'
})
export class CashfreeService {
    private apiUrl = `${environment.apiUrl}/payments`;


    constructor(private http: HttpClient) {
        App.addListener('appUrlOpen', ({ url }) => {
            this.handleDeepLink(url);
        });
    }

    // Create order on your backend
    createOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/create-order`, orderData);
    }

    // // Verify payment status
    // verifyPayment(orderId: string, referenceId: string): Observable<any> {
    //     return this.http.get(`${this.apiUrl}/verify-payment?orderId=${orderId}&referenceId=${referenceId}`);
    // }

    // Get order status
    getOrderStatus(orderId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/order-status/${orderId}`);
    }

    // async initiatePayment(orderToken: string, orderId: string): Promise<void> {
    //     // Base URL for Cashfree payment page
    //     debugger
    //     const paymentUrl = environment.production
    //         ? 'https://www.cashfree.com/checkout/post/submit'
    //         : 'https://test.cashfree.com/billpay/checkout/post/submit';

    //     const redirectUrl = `${environment.appScheme}://payment-callback`;

    //     // Open the browser with the payment URL
    //     await Browser.open({
    //         url: `${paymentUrl}?orderToken=${orderToken}&orderId=${orderId}&redirectUrl=${encodeURIComponent(redirectUrl)}`,
    //         presentationStyle: 'popover'
    //     });
    // }

    private handleDeepLink(url: string): void {
        if (url.includes('payment-callback')) {
            Browser.close();

            // Extract payment result from URL if needed
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const txStatus = urlParams.get('txStatus');
            const orderId = urlParams.get('orderId');
            const txMsg = urlParams.get('txMsg');

            // Verify payment status with backend
            if (orderId) {
                this.verifyPayment(orderId).subscribe(
                    response => {
                        // Handle payment result
                        this.handlePaymentResult(response);
                    },
                    error => {
                        console.error('Payment verification failed', error);
                    }
                );
            }
        }
    }

    private handlePaymentResult(result: any): void {
        // Emit event or use a callback to notify your app about payment result
        // You can use a subject or event emitter here
    }

    verifyPayment(orderId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-payment`, { orderId });
    }
}