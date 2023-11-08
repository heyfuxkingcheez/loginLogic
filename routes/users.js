const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../schemas/user');

// 회원가입 API
router.post('/users', async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;

    // 1. 패스워드, 패스워드 검증 값이 일치하는가 - OK
    // 2. email에 해당하는 사용자가 있는가 - OK
    // 3. nickname에 해당하는 사용자가 있는가 - OK
    // 4. DB에 데이터를 삽입 - OK

    if (password !== confirmPassword) {
        res.status(400).json({
            errorMessage: '패스워드가 패스워드 확인과 다릅니다.',
        });
        return; // 다음 코드로 진행 안되게 하는거
    }

    // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
    const existsEmail = await User.findOne({
        $or: [{ email }],
    });
    if (existsEmail) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
        res.status(400).json({
            errorMessage: '이메일이 이미 사용중입니다.',
        });
        return; // 다음 코드로 진행 안되게 하는거
    }

    const existsNickname = await User.findOne({
        $or: [{ nickname }],
    });
    if (existsNickname) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
        res.status(400).json({
            errorMessage: '닉네임이 이미 사용중입니다.',
        });
        return; // 다음 코드로 진행 안되게 하는거
    }

    const user = new User({ email, nickname, password });
    await user.save();

    res.status(201).json({});
});

// 로그인 API
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // 이메일 검증
    if (!user) {
        res.status(400).json({
            errorMessage: '존재하지 않는 이메일입니다.',
        });
        return;
    }
    // 비밀번호 검증
    if (password !== user.password) {
        res.status(400).json({
            errorMessage: '비밀번호가 틀렸습니다..',
        });
        return;
    }

    const token = jwt.sign({ userId: user._id }, 'woogiSecretKEY');

    res.status(200).json({
        token: token,
    });
});

module.exports = router;
