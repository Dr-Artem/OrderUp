import { useFormik } from 'formik';
import { Api } from 'js/api';
import { useState } from 'react';
import * as yup from 'yup';

import HistoryList from 'components/HistoryList/HistoryList';
import style from './HistoryPage.module.css';

const variable = new Api();
const regexNumber = /^\+\d{1,3}\s?s?\d{1,}\s?\d{1,}\s?\d{1,}$/;
const schema = yup.object().shape({
    phone: yup.string().matches(regexNumber, 'Invalid phone number').required('Phone is a required field'),
});

const HistoryPage = () => {
    const [orders, setOrders] = useState(null);

    const formik = useFormik({
        initialValues: {
            phone: '',
        },
        validationSchema: schema,
        onSubmit: values => {
            handleSubmitForm(values);
        },
    });

    const handleSubmitForm = values => {
        const phoneNumber = values.phone;
        const allOrdersByNumber = variable.allOrdersByNumber(phoneNumber);
        allOrdersByNumber.then(({ data }) => {
            setOrders(data.orders);
        });
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className={style.phoneInputWrapper}>
                    <input
                        className={style.phoneInput}
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+380"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        {...formik.getFieldProps('phone')}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div className={style.helperText}>{formik.errors.phone}</div>
                    ) : null}
                </div>
                <button className={style.phoneSubmitBtn} type="submit">
                    Submit
                </button>
            </form>
            <HistoryList orders={orders} />
        </>
    );
};
export default HistoryPage;
