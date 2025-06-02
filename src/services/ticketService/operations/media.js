
/**
 * 下载票据（生成PDF链接） - Mock implementation
 * @param {string} ticketId - 票据ID
 * @returns {Promise<string>} PDF下载链接
 */
export const downloadTicket = (ticketId) => {
  // logTicketOperation('DOWNLOAD_TICKET', 'STARTED', { ticketId });
  console.warn(`downloadTicket for ${ticketId} is a mock implementation. No API endpoint provided.`);
  // This remains a mock as no API endpoint was provided for actual PDF generation/download.
  // In a real scenario, this would call an API that returns a PDF file or a link to it.
  // logTicketOperation('DOWNLOAD_TICKET', 'FINISHED', { ticketId, status: 'mocked' });
  return Promise.resolve(`data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAFttFrKjkMMvfsr9svAnoh57oKgE9XTPdclvTzN//+fT4WARwyZ5XVlrb1LnF/++X38/P79+Nfxu8NnrubpLu7j5j1+r3ng+POIJ+NBpvEKn70fKsSPcz9SR82bE4fPsR97PjAzfQ0Tj1ZuOvmaqzjH6XMZ5vGCQgLig9sI0ihxqr/7cdK64A1miDwaXGKeCXD0qOByzKySnwVSgxj4QinSSmGWVTW4Vyq90SudbAMnwmBXvnviGhCYhszjfsVC9RJF6oTLRLXJQStUqRQ6KtcJVj3rUeJKd9Se+2CJkvGQ1Cchk9T2EoVvPoQQnbTL`);
};