'use strict';

angular.module('ThreatKB')
    .factory('AuthService', ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {
            // create user variable
            var user = null;
            var admin = null;
            var user_dict = null;

            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                isAdmin: isAdmin,
                login: login,
                logout: logout,
                register: register,
                getUserStatus: getUserStatus,
                getUser: getUser,
                user: getUser,
                getMe: getMe,
                changePassword: changePassword,
                getOwnershipData: getOwnershipData
            });

            function isLoggedIn() {
                return !!user;
            }

            function isAdmin() {
                return !!admin;
            }

            function getUser() {
                return user_dict;
            }

            function changePassword(old_password, new_password1, new_password2) {
                return $http.put('/ThreatKB/users/me/password', {
                    old_password: old_password,
                    new_password1: new_password1,
                    new_password2: new_password2
                })
                    .then(function (success) {
                            if (success.status === 200 && success.data) {
                                return success.data;
                            } else {
                                return "error";
                            }
                        },
                        function (error) {
                            return $q.reject(error.data);
                        }
                    )
            }

            function getMe() {
                return $http.get('/ThreatKB/users/me')
                    .then(function (success) {
                            if (success.status === 200 && success.data) {
                                return success.data;
                            } else {
                                //TODO
                            }
                        }, function (error) {
                            return $q.reject(error.data);
                        }
                    );
            }

            function login(email, password) {
                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/ThreatKB/login', {email: email, password: password})
                    .then(function (success) {
                        if (success.status === 200 && success.data.result) {
                            user = true;
                            admin = !!success.data.a;
                            user_dict = success.data.user;
                            deferred.resolve();
                        } else {
                            user = false;
                            admin = false;
                            user_dict = {};
                            deferred.reject();
                        }
                    }, function (error) {
                        user = false;
                        admin = false;
                        user_dict = {};
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {
                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/ThreatKB/logout')
                    .then(function (success) {
                        user = false;
                        admin = false;
                        user_dict = {};
                        deferred.resolve();
                    }, function (error) {
                        user = false;
                        admin = false;
                        user_dict = {};
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function register(email, password) {
                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/ThreatKB/register', {email: email, password: password})
                    .then(function (success) {
                        if (success.status === 200 && success.data.result) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }, function (error) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

            function getUserStatus() {
                return $http.get('/ThreatKB/status')
                    .then(function (success) {
                        user = success.status === 200 && success.data.status;
                        user_dict = success.data.user;
                        admin = success.data.a;
                    }, function (error) {
                        user = false;
                        admin = false;
                        user_dict = {};
                    });
            }

            function getOwnershipData() {
                return $http.get('/ThreatKB/users/ownership')
                    .then(function (success) {
                            if (success.status === 200 && success.data) {
                                return success.data;
                            } else {
                                //TODO
                            }
                        }, function (error) {
                            return $q.reject(error.data);
                        }
                    );
            }




        }])
    .factory('UserService', ['$resource', function ($resource) {
        return $resource('ThreatKB/users/:id', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {method: 'GET'},
            'update': {method: 'PUT'}
        });
    }]);
