(function ()
{
    'use strict';
    var userDAO = require( '../DAO/userDAO' );
    var tokenDAO = require( '../DAO/tokenDAO' );
    var sha1 = require('sha1');
    var q = require('q');

    module.exports = function (router)
    {
        router.route('/api/user/auth').post(function (request, response)
        {
            userDAO.getByEmail( request.body.email ).then( function( data ) {
                if( data.password === sha1( request.body.password ) ) {
                    tokenDAO.addToken( data._id ).then( function( data ) {
                        response.status(200).send({token: data});
                    } );
                }
                else {
                    var defer = q.defer();
                    defer.reject('UNAUTHORIZED');
                    return defer.promise;
                }

            }).catch(function (error)
            {
                if ('UNAUTHORIZED' === error) {
                    response.sendStatus(401);
                } else if ('NOT_FOUND' === error) {
                    response.sendStatus(404);
                } else {
                    response.sendStatus(500);
                }
            });
        });
    };
})();