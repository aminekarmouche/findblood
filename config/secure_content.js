module.exports = {
    ensureAuthenticated : (req, res, next) =>{
        if(req.isAuthenticated()){
            return next();
        }
        throw new Error('You need to login to view this page');
        
    }
    
};
