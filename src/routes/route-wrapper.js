/* Para garantir que as áreas privadas da aplicação não fiquem acessíveis para usuários indevidos */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';
/* Se o usuário está autenticado, retorna o próprio componente que ele está tentando renderizar.
 * Caso contrário, redirecionamos o usuário para a tela de autenticação correspondente a ele */
const RouteWrapper = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/signin", state: { from: props.location } }} />
                )
        }
    />
)

export default RouteWrapper;