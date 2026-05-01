import React from 'react';
import './SupportedClasses.css';

const classes = [
    { name: 'Normal', desc: 'Clear skin' },
    { name: 'Acne', desc: 'Papules, pustules, nodules' },
    { name: 'Dry', desc: 'Flaky or rough texture' },
    { name: 'Eczema', desc: 'Redness, scaling, itching' },
    { name: 'Mole', desc: 'Pigmented lesions' }
];

const SupportedClasses = () => {
    return (
        <div className="supported-classes">
            <h3>Supported Conditions</h3>
            <div className="classes-grid">
                {classes.map((item) => (
                    <div key={item.name} className="class-item">
                        <span className="class-name">{item.name}</span>
                        <span className="class-desc">{item.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupportedClasses;
