import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CashfreeService } from 'src/app/core/services/cashfree.service';
import { environment } from 'src/environments/environment';
import { load } from '@cashfreepayments/cashfree-js';
import { CFEnvironment, CFPaymentGateway, CFSession, CFWebCheckoutPayment } from "@awesome-cordova-plugins/cashfree-pg";
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast.services';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  orderAmount: number = 0;
  orderId: string = '';
  paymentSessionId: string = '';
  orderCurrency: string = 'INR';

  constructor(
    private cashfreeService: CashfreeService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.orderAmount = params['amount'] || 0;
      this.initializePayment();
    });
  }

  initializePayment() {
    const orderData = {
      orderAmount: this.orderAmount,
      orderCurrency: this.orderCurrency,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '9999999999'
    };

    this.cashfreeService.createOrder(orderData).subscribe(
      (response: any) => {
        this.orderId = response.orderId;
        this.paymentSessionId = response.paymentSessionId;
        this.initiateWebPayment();
      },
      (error: any) => {
        console.error('Order creation failed:', error);
      }
    );
  }

  async initiateWebPayment() {
    try {
      // Show loading indicator
      const loading = await this.loadingController.create({
        message: 'Preparing payment...',
      });
      await loading.present();

      // Define callback functions
      const callbacks = {
        onVerify: (result: any) => {
          console.log("Payment verification successful: ", JSON.stringify(result));
          loading.dismiss();
          // Handle successful payment
          this.handleSuccessfulPayment(result);
        },
        onError: (error: any) => {
          console.log("Payment error: ", JSON.stringify(error));
          loading.dismiss();
          // Handle payment error
          this.handlePaymentError(error);
        }
      };

      // Set the callback functions
      CFPaymentGateway.setCallback(callbacks);

      // Initiate web checkout
      CFPaymentGateway.doWebCheckoutPayment(
        new CFWebCheckoutPayment(
          new CFSession(
            this.paymentSessionId,  // This should come from your .NET backend
            this.orderId,           // This should be your order ID
            CFEnvironment.SANDBOX   // Use PRODUCTION for live environment
          ),
          null  // Payment components - null means use the default components
        )
      );
    } catch (error) {
      console.error('Error in payment initialization:', error);
      // Dismiss loading indicator if there's an error
      if (this.loadingController) {
        this.loadingController.dismiss();
      }
      // Show error to user
      this.toast.presentErrorToast('Failed to initialize payment. Please try again.');
    }
  }

  // Handle successful payment
  private handleSuccessfulPayment(result: any) {
    // Send the result to your backend to verify payment
    this.cashfreeService.verifyPayment(this.orderId).subscribe(
      (verificationResponse) => {
        if (verificationResponse.verified) {
          this.toast.presentSuccessToast('Payment completed successfully!');
          // Navigate to success page or order confirmation
          this.router.navigate(['/payment-success']);
        } else {
          this.toast.presentErrorToast('Payment was processed but verification failed. Please contact support.');
        }
      },
      (error: any) => {
        console.error('Verification error:', error);
        this.toast.presentErrorToast('Failed to verify payment status. Please contact support.');
      }
    );
  }

  // Handle payment error
  private handlePaymentError(error: any) {
    let errorMessage = 'Payment failed. Please try again.';

    // Extract more specific error message if available
    if (error && error.message) {
      errorMessage = error.message;
    }

    this.toast.presentErrorToast(errorMessage);
  }

}
