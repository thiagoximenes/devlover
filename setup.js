#!/usr/bin/env node

/**
 * DevManager Pro - Setup Script
 * 
 * Este script automatiza o setup inicial do projeto.
 * Execute: node setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para output no terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
    log(`\n[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function exec(command, errorMessage) {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        logError(errorMessage);
        return false;
    }
}

function checkFile(filePath) {
    return fs.existsSync(filePath);
}

async function main() {
    log('\n🚀 DevManager Pro - Setup Automatizado\n', 'bright');

    // Step 1: Verificar Node.js
    logStep(1, 'Verificando versão do Node.js...');
    try {
        const nodeVersion = execSync('node --version').toString().trim();
        const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));

        if (majorVersion >= 18) {
            logSuccess(`Node.js ${nodeVersion} detectado`);
        } else {
            logWarning(`Node.js ${nodeVersion} detectado. Recomendado: v18 ou superior`);
        }
    } catch (error) {
        logError('Node.js não encontrado. Instale em: https://nodejs.org/');
        process.exit(1);
    }

    // Step 2: Verificar npm
    logStep(2, 'Verificando npm...');
    try {
        const npmVersion = execSync('npm --version').toString().trim();
        logSuccess(`npm ${npmVersion} detectado`);
    } catch (error) {
        logError('npm não encontrado');
        process.exit(1);
    }

    // Step 3: Instalar dependências
    logStep(3, 'Instalando dependências (isso pode levar alguns minutos)...');
    const installSuccess = exec(
        'npm install',
        'Falha ao instalar dependências. Tente manualmente: npm install'
    );

    if (!installSuccess) {
        process.exit(1);
    }
    logSuccess('Dependências instaladas com sucesso');

    // Step 4: Verificar .env.local
    logStep(4, 'Verificando arquivo de configuração...');
    const envPath = path.join(__dirname, '.env.local');

    if (!checkFile(envPath)) {
        logWarning('.env.local não encontrado');
        log('\n📝 Criando .env.local a partir do template...');

        try {
            const examplePath = path.join(__dirname, '.env.example');
            if (checkFile(examplePath)) {
                fs.copyFileSync(examplePath, envPath);
                logSuccess('.env.local criado');
                log('\n⚠️  ATENÇÃO: Edite o arquivo .env.local e adicione suas credenciais do Supabase!', 'yellow');
                log('   1. Acesse: https://supabase.com/dashboard/project/_/settings/api');
                log('   2. Copie a URL do projeto e a chave pública (anon)');
                log('   3. Cole no arquivo .env.local\n');
            } else {
                logWarning('.env.example não encontrado. Crie .env.local manualmente.');
            }
        } catch (error) {
            logError('Erro ao criar .env.local');
        }
    } else {
        // Verificar se as variáveis foram configuradas
        const envContent = fs.readFileSync(envPath, 'utf-8');

        if (envContent.includes('seu-projeto.supabase.co') || envContent.includes('sua-chave-publica-aqui')) {
            logWarning('.env.local existe mas parece não estar configurado');
            log('\n⚠️  Edite o arquivo .env.local com suas credenciais reais do Supabase', 'yellow');
        } else {
            logSuccess('.env.local configurado');
        }
    }

    // Step 5: Verificar Git
    logStep(5, 'Verificando Git...');
    try {
        execSync('git --version', { stdio: 'pipe' });
        logSuccess('Git detectado');

        // Verificar se já é um repositório Git
        if (checkFile(path.join(__dirname, '.git'))) {
            logSuccess('Repositório Git já inicializado');
        } else {
            log('\n📝 Deseja inicializar um repositório Git? (recomendado)');
            logWarning('Execute manualmente: git init');
        }
    } catch (error) {
        logWarning('Git não encontrado. Instale em: https://git-scm.com/');
    }

    // Step 6: Verificar migrations
    logStep(6, 'Verificando migrations SQL...');
    const migrationsPath = path.join(__dirname, 'supabase', 'migrations');

    if (fs.existsSync(migrationsPath)) {
        const migrations = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'));
        logSuccess(`${migrations.length} migration(s) encontrada(s)`);
        log('\n📝 Lembre-se de executar as migrations no Supabase SQL Editor!');
    } else {
        logWarning('Diretório de migrations não encontrado');
    }

    // Step 7: Resumo final
    log('\n' + '='.repeat(60), 'bright');
    log('✅ Setup concluído com sucesso!', 'green');
    log('='.repeat(60), 'bright');

    log('\n📋 Próximos passos:\n');
    log('1. Configure o arquivo .env.local com suas credenciais do Supabase', 'cyan');
    log('2. Crie um projeto no Supabase: https://supabase.com', 'cyan');
    log('3. Execute as migrations SQL no SQL Editor do Supabase', 'cyan');
    log('4. Inicie o servidor de desenvolvimento:', 'cyan');
    log('   npm run dev\n', 'bright');

    log('📚 Documentação completa:', 'cyan');
    log('   - README.md - Visão geral do projeto');
    log('   - SETUP.md - Guia passo a passo detalhado');
    log('   - TROUBLESHOOTING.md - Soluções de problemas\n');

    log('🚀 Bom desenvolvimento!\n', 'green');
}

// Executar setup
main().catch(error => {
    logError(`Erro durante o setup: ${error.message}`);
    process.exit(1);
});
