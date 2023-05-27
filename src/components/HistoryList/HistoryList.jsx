import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

import dayjs from 'dayjs';
import { useState } from 'react';

const HistoryList = ({ orders }) => {
    const [expanded, setExpanded] = useState(false);

    const handleChangeAccardion = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '16px' }}>
            {orders?.map(({ address, costumer, phoneNumber, products, total, _id, createdAt }) => {
                const orderDate = dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');

                return (
                    <Accordion
                        key={_id}
                        expanded={expanded === `${_id}`}
                        disableGutters
                        onChange={handleChangeAccardion(`${_id}`)}
                        sx={{
                            borderRadius: '8px',
                            '::before': { display: 'none' },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Box sx={{ width: '33%', flexShrink: 0, alignSelf: 'center' }}>
                                <Typography
                                    sx={{
                                        fontSize: 22,
                                        color: 'var(--main-text)',
                                        lineHeight: '26px',
                                        fontWeight: 500,
                                    }}
                                >
                                    Order:{' '}
                                    <Typography
                                        component={'span'}
                                        sx={{ color: 'var(--main-text)', fontSize: 16, lineHeight: '18px' }}
                                    >
                                        #{_id}
                                    </Typography>
                                </Typography>
                            </Box>

                            <Box sx={{ width: '33%', flexShrink: 0, alignSelf: 'center' }}>
                                <Typography sx={{ color: 'text.secondary' }}>{orderDate}</Typography>
                            </Box>
                            <Box sx={{ width: '33%', flexShrink: 0 }}>
                                <Typography sx={{ color: 'text.secondary', mb: '8px' }}>{address}</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>Total: {total}&#8372;</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                                sx={{
                                    display: 'flex',
                                    rowGap: '32px',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {products.map(({ product, quantity }) => {
                                    return (
                                        <Box
                                            style={{ display: 'flex', flexBasis: 'calc((100% - (16px * 2)) / 3)' }}
                                            key={product._id}
                                        >
                                            <img
                                                src={product.imageUrl}
                                                style={{
                                                    borderRadius: '12px',
                                                }}
                                                width={150}
                                                height={150}
                                                alt=""
                                            />
                                            <Box
                                                sx={{
                                                    p: '8px 16px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 20,
                                                        fontWeight: 500,
                                                        color: 'var(--main-text)',
                                                    }}
                                                >
                                                    {product.name}
                                                </Typography>
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            color: 'var(--main-text)',
                                                        }}
                                                    >
                                                        Price: {product.price}&#8372;
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            color: 'var(--main-text)',
                                                        }}
                                                    >
                                                        Quantity: {quantity}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
};
export default HistoryList;
