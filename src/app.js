import express from 'express';

const getNanoseconds = () => {
    const hrtime = process.hrtime();
    const nanoseconds = hrtime[0] * 1e9 + hrtime[1];
    const millisecondsSinceEpoch = Date.now();
    const nanosecondsSinceEpoch = BigInt(millisecondsSinceEpoch) * BigInt(1e6) + BigInt(nanoseconds % 1e6);

    return Number(nanosecondsSinceEpoch);
};