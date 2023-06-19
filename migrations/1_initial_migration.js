const Migrations= artifacts.require("Credit");


module.exports= function (deployer){
    deployer.deploy(Migrations);
};