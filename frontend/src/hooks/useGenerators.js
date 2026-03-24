import { useState } from 'react'

const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const randWord = () => LOREM[Math.floor(Math.random() * LOREM.length)]

const randSentence = () => {
    const len = 6 + Math.floor(Math.random() * 10)
    const words = Array.from({ length: len }, randWord)
    words[0] = words[0][0].toUpperCase() + words[0].slice(1)
    return words.join(' ') + '.'
}

export default function useGenerators(setText, showAlert) {
    const [textGenType, setTextGenType] = useState('words')
    const [textGenCount, setTextGenCount] = useState(50)
    const [pwdLen, setPwdLen] = useState(16)
    const [pwdOpts, setPwdOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true })
    const [generatedPwd, setGeneratedPwd] = useState('')

    const handleGenerateText = () => {
        let result
        if (textGenType === 'words') {
            result = Array.from({ length: textGenCount }, randWord).join(' ')
        } else if (textGenType === 'sentences') {
            result = Array.from({ length: textGenCount }, randSentence).join(' ')
        } else {
            result = Array.from({ length: textGenCount }, () => {
                const sentCount = 4 + Math.floor(Math.random() * 4)
                return Array.from({ length: sentCount }, randSentence).join(' ')
            }).join('\n\n')
        }
        setText(result)
        showAlert('Random text generated', 'success')
        return result
    }

    const handleGeneratePassword = () => {
        const pools = []
        if (pwdOpts.upper)   pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        if (pwdOpts.lower)   pools.push('abcdefghijklmnopqrstuvwxyz')
        if (pwdOpts.numbers) pools.push('0123456789')
        if (pwdOpts.symbols) pools.push('!@#$%^&*()-_=+[]{}|;:,.<>?')
        if (!pools.length) { showAlert('Select at least one character type', 'danger'); return }
        const chars = pools.join('')
        const arr = new Uint32Array(pwdLen)
        crypto.getRandomValues(arr)
        const pwd = Array.from(arr).map(x => chars[x % chars.length]).join('')
        setGeneratedPwd(pwd)
        showAlert('Password generated', 'success')
        return pwd
    }

    return {
        textGenType, setTextGenType,
        textGenCount, setTextGenCount,
        pwdLen, setPwdLen,
        pwdOpts, setPwdOpts,
        generatedPwd, setGeneratedPwd,
        handleGenerateText,
        handleGeneratePassword,
    }
}
