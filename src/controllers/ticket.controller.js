import TicketService from "../services/tickets.service.js";
import UserService from "../services/user.service.js";

export default class TicketController {
  constructor() {
    this.ticketService = new TicketService();
    this.userService = new UserService();
  }

 async createTicket(req) {
    try {

        const data = req.body;
        const ticket = await this.ticketService.createTicket(data);
        if (ticket) {
            console.log(ticket);
            const thisTicket = ticket.code;
            console.log(thisTicket);

        } 
       //
        
        //return res.status(200).json({ status: "success", redirect: `/tickets/${thisTicket}` });
    } catch (error) {
       console.log(error);  
    }
    }
     
    async getTicketDetail (req, res){
        let {code} = req.params;
        let user = await this.userService.findOne(req.user.email);
        try {
            let ticket = await this.ticketService.getTicketByOnlyCode(code);
            console.log("Ticket");
            console.log(ticket);
            if(ticket === null){
                res.render('error', {error: `404 - El ticket solicitado no existe.`, user})
            } else {
                res.render('ticketDetail', {ticket, user})
            }
        } catch (error) {
            res.render('error', {error: `404 - El ticket solicitado no se encuentra disponible`, user})            
        }
    }


}
