// src/tasks/loanExpiryTask.ts
import { CronJob } from "cron";
import { loanRepository } from "repository/loan.repository";
import { mailService } from "@mail/mail.service";
import { loanOverdueTemplate } from "@mail/loan.mail";

class LoanTask {
  initLoanJob() {
    this.expiryLoan();
  }

  private expiryLoan() {
    new CronJob(
      "0 0 8 * * 1-5",
      async () => {
        try {
          const overdueLoans = await loanRepository.findOverdueLoans();

          const receivers = await loanRepository.findReceiverForExpiry(
            overdueLoans.map((_) => _.idDepartment),
          );

          for (const loan of overdueLoans) {
            await mailService.send({
              to: receivers.map((_) => _.email),
              subject: `ALERTA: Préstamo #${loan.id.slice(0, 8)} Vencido`,
              attachments: undefined,
              html: loanOverdueTemplate({
                authorizerName: "Almacenista / Autorizador",
                requesterName: loan.name,
                loanId: loan.id,
                expectedReturnDate: loan.returnDate.toLocaleDateString(),
                daysOverdue: this.calcularDias(loan.returnDate),
                tools: loan.loanDetails.map((d) => d.tool),
                actionUrl: `${process.env.FRONTEND_URL}/loans/${loan.id}`,
              }),
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      null,
      true,
      "America/Tegucigalpa",
    );
  }

  private calcularDias = (date: Date) => {
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };
}

export const loanTask = new LoanTask();
