import React from 'react';

const Footer = ({ tableManager }) => {
    const {
        config: {
            isPaginated,
            showRowsInformation,
            components: {
                Information,
                PageSize,
                Pagination
            },
            additionalProps: { footer: additionalProps = {} },
        }
    } = tableManager;

    const classNames = ('rgt-footer ' + (additionalProps.className || '')).trim();

    return (
        <div {...additionalProps} className={classNames}>
                {
                    showRowsInformation !== false ?
                        <Information tableManager={ tableManager } />
                        :
                        <span></span>
                }
            {
                isPaginated ?
                    <div className='rgt-footer-right-container'>
                        <PageSize tableManager={ tableManager } />
                        <Pagination tableManager={ tableManager } />
                    </div>
                    :
                    null
            }
        </div>
    )
};

export default Footer;