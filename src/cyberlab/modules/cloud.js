/* ============================================================================
   MÓDULO: Cloud / AWS Security
   IAM policies, S3 buckets, EC2, Lambda, shared responsibility.
   env = { users, buckets, instances, policies }
============================================================================ */

const initEnv = () => ({
    users: {
        'admin': { arn: 'arn:aws:iam::123456789012:user/admin', policies: ['AdministratorAccess'], mfa: true, access_keys: 1 },
        'developer': { arn: 'arn:aws:iam::123456789012:user/developer', policies: ['AmazonEC2FullAccess', 'AmazonS3ReadOnlyAccess'], mfa: false, access_keys: 2 },
        'lambda-svc': { arn: 'arn:aws:iam::123456789012:role/lambda-execution', policies: ['AWSLambdaBasicExecutionRole', 'AmazonS3ReadOnlyAccess'], type: 'role' }
    },
    buckets: {
        'prod-logs': { acl: 'private', encryption: 'AES-256', versioning: true, public: false },
        'backups-old': { acl: 'public-read', encryption: 'none', versioning: false, public: true, files: ['database-dump-2024-01-14.sql', 'ssh-keys.pem'] },
        'website-assets': { acl: 'public-read-write', encryption: 'none', versioning: false, public: true, risk: 'anyone can upload' }
    },
    instances: {
        'web-prod': { instance_id: 'i-0a1b2c3d4e5f6g7h8', type: 't3.medium', sg: 'sg-12345', ports: [22, 80, 443], public_ip: '203.0.113.45', security_issue: 'SSH abierto al mundo (0.0.0.0/0)' },
        'db-prod': { instance_id: 'i-1b2c3d4e5f6g7h8i9', type: 'r6i.2xlarge', sg: 'sg-54321', ports: [3306], public_ip: 'none', security_issue: 'bien segmentado' }
    }
})

const commands = {
    'iam-list-users': (args, env) => {
        const out = ['User                 Policies                           MFA   Access Keys']
        Object.entries(env.users).forEach(([name, u]) => {
            if (u.type === 'role') return
            const policies = u.policies.join(', ').slice(0, 25)
            out.push(`${name.padEnd(20)} ${policies.padEnd(30)} ${u.mfa ? 'Yes' : 'NO ⚠'}   ${u.access_keys}`)
        })
        return { out, events: [{ t: 'enum_iam', what: 'users' }] }
    },

    'iam-get-policy': (args, env) => {
        const policy = args[0]
        if (!policy) return { out: ['uso: iam-get-policy <policy-name>'] }
        if (policy === 'AdministratorAccess') {
            return {
                out: [
                    '{',
                    '  "Version": "2012-10-17",',
                    '  "Statement": [',
                    '    {',
                    '      "Effect": "Allow",',
                    '      "Action": "*",',
                    '      "Resource": "*"',
                    '    }',
                    '  ]',
                    '}',
                    '',
                    '⚠ Esta policy = acceso total a TODO. Peligroso.'
                ],
                events: [{ t: 'inspect_policy', policy }]
            }
        }
        return { out: [`Policy ${policy} encontrada (simulado)`] }
    },

    's3-list-buckets': (args, env) => {
        const out = ['Bucket Name         Public  Encryption  Risk']
        Object.entries(env.buckets).forEach(([name, b]) => {
            out.push(`${name.padEnd(19)} ${b.public ? 'YES ⚠' : 'no'}     ${b.encryption || 'none'} ${b.risk || 'low'}`)
        })
        return { out, events: [{ t: 'enum_s3' }] }
    },

    's3-bucket-acl': (args, env) => {
        const bucket = args[0]
        if (!bucket) return { out: ['uso: s3-bucket-acl <bucket-name>'] }
        const b = env.buckets[bucket]
        if (!b) return { out: [`Bucket ${bucket} no encontrado`] }
        const out = [`ACL de ${bucket}:`, `  ${b.acl}`]
        if (b.files) {
            out.push('', 'Archivos públicos:')
            b.files.forEach(f => out.push(`  - ${f} (⚠ descargables por anyone)`))
        }
        return { out, events: [{ t: 'check_s3_acl', bucket }] }
    },

    'ec2-list-instances': (args, env) => {
        const out = ['Instance ID           Type           Public IP      Security Group']
        Object.entries(env.instances).forEach(([name, i]) => {
            out.push(`${i.instance_id.padEnd(21)} ${i.type.padEnd(14)} ${(i.public_ip || 'private').padEnd(14)} ${i.sg}`)
        })
        return { out, events: [{ t: 'enum_ec2' }] }
    },

    'sg-describe': (args, env) => {
        const sg = args[0] || 'sg-12345'
        if (sg === 'sg-12345') {
            return {
                out: [
                    `Security Group: ${sg} (web-prod)`,
                    'Inbound Rules:',
                    '  Port 22 (SSH)   from 0.0.0.0/0 ⚠ OPEN AL MUNDO',
                    '  Port 80 (HTTP)  from 0.0.0.0/0 ✓ normal',
                    '  Port 443 (HTTPS) from 0.0.0.0/0 ✓ normal',
                    'Outbound Rules:',
                    '  All traffic allowed',
                    '',
                    '⚠ SSH abierto al mundo es riesgo. Debe estar restringido a IPs específicas.'
                ],
                events: [{ t: 'check_sg', sg }]
            }
        }
        return { out: [`Security Group ${sg} bien configurado`] }
    },

    'shared-responsibility': () => ({
        out: [
            '=== AWS Shared Responsibility Model ===',
            '',
            'AWS es responsable de ("Security OF the cloud"):',
            '  - Infraestructura física (datacenters)',
            '  - Networking (DDoS protection)',
            '  - Hipervisor y hardware',
            '  - Servicios managed (RDS, Lambda, etc)',
            '',
            'TÚ eres responsable de ("Security IN the cloud"):',
            '  - Configuración de IAM (quién accede qué)',
            '  - Network security (VPC, security groups)',
            '  - Encriptación de datos (en tránsito y en reposo)',
            '  - Parcheo de sistemas operativos (en EC2)',
            '  - Logs y monitoreo',
            '',
            'Riesgos comunes por mala config:',
            '  1. S3 buckets públicos (backups/dumps expuestos)',
            '  2. Security groups muy abiertos (SSH desde 0.0.0.0)',
            '  3. IAM con acceso excesivo (developers con AdministratorAccess)',
            '  4. Credenciales en código o logs',
            '  5. Sin MFA en cuentas importantes'
        ]
    }),

    'help': () => ({ out: ['Comandos AWS disponibles:', '  iam-list-users  iam-get-policy <name>  s3-list-buckets  s3-bucket-acl <bucket>', '  ec2-list-instances  sg-describe <sg-id>  shared-responsibility  help'] })
}

const missions = [
    {
        id: 'aws1', title: 'Enumera usuarios IAM', xp: 60,
        brief: 'IAM es el guardián de AWS. Cada usuario/role tiene policies. Developer sin MFA es riesgo; admin sin MFA es crítico.',
        obj: 'Lista los usuarios IAM y nota quién no tiene MFA.',
        hint: 'iam-list-users',
        check: ev => ev.some(e => e.t === 'enum_iam' && e.what === 'users')
    },
    {
        id: 'aws2', title: 'Inspecciona políticas de acceso', xp: 70,
        brief: 'AdministratorAccess = acceso total. Nunca debería estar en usuarios normales. Usa principio de menor privilegio: cada rol solo lo que necesita.',
        obj: 'Inspecciona la policy AdministratorAccess.',
        hint: 'iam-get-policy AdministratorAccess',
        check: ev => ev.some(e => e.t === 'inspect_policy')
    },
    {
        id: 'aws3', title: 'Descubre buckets S3 públicos', xp: 90,
        brief: 'S3 buckets son almacenamientos. Si son públicos, cualquiera puede leer (o escribir). Muchos breaches vienen de S3 mal configurado.',
        obj: 'Lista todos los buckets y revisa ACLs de "backups-old".',
        hint: 's3-list-buckets\ns3-bucket-acl backups-old',
        check: ev => ev.some(e => e.t === 'check_s3_acl')
    },
    {
        id: 'aws4', title: 'Revisa security groups de EC2', xp: 80,
        brief: 'Security groups = firewalls de EC2. Si abres puerto 22 al mundo (0.0.0.0/0), cualquiera puede intentar SSH brute-force.',
        obj: 'Lista instancias EC2 y revisa el security group sg-12345.',
        hint: 'ec2-list-instances\nsg-describe sg-12345',
        check: ev => ev.some(e => e.t === 'check_sg')
    }
]

export default {
    id: 'cloud', icon: '☁️', name: 'Cloud / AWS Security', sub: 'IAM, S3, EC2, Lambda, shared responsibility',
    initEnv,
    prompt: () => 'aws>',
    intro: ['Módulo CLOUD/AWS cargado. AWS = nube pública. Security aquí es configuración: IAM, buckets, redes.',
        'Una mala config = breach. Una buena = seguridad + escalabilidad.'],
    commands, missions
}