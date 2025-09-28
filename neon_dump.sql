--
-- PostgreSQL database dump
--

\restrict Qey8RDiUfG0ehzWand4fXqGM83goxJi7fNeOZmLmtHiaKRk2eAzM4fOyFyCmm6o

-- Dumped from database version 17.5 (84bec44)
-- Dumped by pg_dump version 17.6 (Ubuntu 17.6-2.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.video_call DROP CONSTRAINT IF EXISTS video_call_student_id_student_profile_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.video_call DROP CONSTRAINT IF EXISTS video_call_payment_id_payment_id_fk;
ALTER TABLE IF EXISTS ONLY public.video_call DROP CONSTRAINT IF EXISTS video_call_mentor_id_mentor_profile_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.student_profile DROP CONSTRAINT IF EXISTS student_profile_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.preferred_time DROP CONSTRAINT IF EXISTS preferred_time_video_id_video_call_id_fk;
ALTER TABLE IF EXISTS ONLY public.preferred_time_log DROP CONSTRAINT IF EXISTS preferred_time_log_video_id_video_call_id_fk;
ALTER TABLE IF EXISTS ONLY public.payment DROP CONSTRAINT IF EXISTS payment_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.mentor_profile DROP CONSTRAINT IF EXISTS mentor_profile_user_id_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.favorite DROP CONSTRAINT IF EXISTS favorite_student_id_student_profile_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.favorite DROP CONSTRAINT IF EXISTS favorite_mentor_id_mentor_profile_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.chat_subscription DROP CONSTRAINT IF EXISTS chat_subscription_student_id_student_profile_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.chat_subscription DROP CONSTRAINT IF EXISTS chat_subscription_payment_id_payment_id_fk;
ALTER TABLE IF EXISTS ONLY public.chat_subscription DROP CONSTRAINT IF EXISTS chat_subscription_mentor_id_mentor_profile_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.account DROP CONSTRAINT IF EXISTS account_user_id_user_id_fk;
DROP INDEX IF EXISTS public.unique_video_id;
DROP INDEX IF EXISTS public.unique_student_mentor;
DROP INDEX IF EXISTS public.unique_active_chat;
ALTER TABLE IF EXISTS ONLY public.video_call DROP CONSTRAINT IF EXISTS video_call_pkey;
ALTER TABLE IF EXISTS ONLY public.verification DROP CONSTRAINT IF EXISTS verification_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_email_unique;
ALTER TABLE IF EXISTS ONLY public.student_profile DROP CONSTRAINT IF EXISTS student_profile_pkey;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_token_unique;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_pkey;
ALTER TABLE IF EXISTS ONLY public.school DROP CONSTRAINT IF EXISTS school_pkey;
ALTER TABLE IF EXISTS ONLY public.rate_limit DROP CONSTRAINT IF EXISTS rate_limit_pkey;
ALTER TABLE IF EXISTS ONLY public.preferred_time_log DROP CONSTRAINT IF EXISTS preferred_time_log_pkey;
ALTER TABLE IF EXISTS ONLY public.preferred_time DROP CONSTRAINT IF EXISTS preferred_table_pkey;
ALTER TABLE IF EXISTS ONLY public.payment DROP CONSTRAINT IF EXISTS payment_pkey;
ALTER TABLE IF EXISTS ONLY public.mentor_profile DROP CONSTRAINT IF EXISTS mentor_profile_pkey;
ALTER TABLE IF EXISTS ONLY public.favorite DROP CONSTRAINT IF EXISTS favorite_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_subscription DROP CONSTRAINT IF EXISTS chat_subscription_pkey;
ALTER TABLE IF EXISTS ONLY public.account DROP CONSTRAINT IF EXISTS account_pkey;
ALTER TABLE IF EXISTS ONLY drizzle.__drizzle_migrations DROP CONSTRAINT IF EXISTS __drizzle_migrations_pkey;
ALTER TABLE IF EXISTS drizzle.__drizzle_migrations ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.video_call;
DROP TABLE IF EXISTS public.verification;
DROP TABLE IF EXISTS public."user";
DROP TABLE IF EXISTS public.student_profile;
DROP TABLE IF EXISTS public.session;
DROP TABLE IF EXISTS public.school;
DROP TABLE IF EXISTS public.rate_limit;
DROP TABLE IF EXISTS public.preferred_time_log;
DROP TABLE IF EXISTS public.preferred_time;
DROP TABLE IF EXISTS public.payment;
DROP TABLE IF EXISTS public.mentor_profile;
DROP TABLE IF EXISTS public.favorite;
DROP TABLE IF EXISTS public.chat_subscription;
DROP TABLE IF EXISTS public.account;
DROP SEQUENCE IF EXISTS drizzle.__drizzle_migrations_id_seq;
DROP TABLE IF EXISTS drizzle.__drizzle_migrations;
DROP TYPE IF EXISTS public.video_call_status;
DROP TYPE IF EXISTS public."suggestedBy";
DROP TYPE IF EXISTS public.subscription_status;
DROP TYPE IF EXISTS public.sex;
DROP TYPE IF EXISTS public.role;
DROP TYPE IF EXISTS public.peferred_time_status;
DROP TYPE IF EXISTS public.payment_type;
DROP TYPE IF EXISTS public.payment_status;
DROP TYPE IF EXISTS public.mentor_verified_status;
DROP SCHEMA IF EXISTS drizzle;
--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- Name: mentor_verified_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.mentor_verified_status AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'paid',
    'failed'
);


--
-- Name: payment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_type AS ENUM (
    'chat_subscription',
    'video_call'
);


--
-- Name: peferred_time_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.peferred_time_status AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


--
-- Name: role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role AS ENUM (
    'none',
    'student',
    'mentor',
    'admin'
);


--
-- Name: sex; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sex AS ENUM (
    'male',
    'female',
    'other'
);


--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_status AS ENUM (
    'active',
    'expired',
    'cancelled'
);


--
-- Name: suggestedBy; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."suggestedBy" AS ENUM (
    'student',
    'mentor'
);


--
-- Name: video_call_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.video_call_status AS ENUM (
    'pending',
    'scheduled',
    'completed',
    'cancelled'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    id text NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at timestamp without time zone,
    refresh_token_expires_at timestamp without time zone,
    scope text,
    password text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: chat_subscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_subscription (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id text NOT NULL,
    mentor_id text NOT NULL,
    payment_id uuid NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    status public.subscription_status DEFAULT 'active'::public.subscription_status,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: favorite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorite (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id text,
    mentor_id text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: mentor_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mentor_profile (
    user_id text NOT NULL,
    country character varying(255),
    city character varying(255),
    zip_code character varying(255),
    phone_number character varying(100),
    nationality character varying(255),
    sex public.sex,
    resume text,
    citizenship_photo_url text,
    image_url text DEFAULT 'https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE'::text,
    verified_status public.mentor_verified_status DEFAULT 'pending'::public.mentor_verified_status,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    bio text
);


--
-- Name: payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    type public.payment_type NOT NULL,
    amount integer NOT NULL,
    currency character varying(20) DEFAULT 'USD'::character varying,
    status public.payment_status DEFAULT 'pending'::public.payment_status,
    stripe_payment_id text,
    stripe_subscription_id text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: preferred_time; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.preferred_time (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    video_id uuid,
    student_preferred_time timestamp with time zone,
    mentor_preferred_time timestamp with time zone,
    status public.peferred_time_status DEFAULT 'pending'::public.peferred_time_status,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: preferred_time_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.preferred_time_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    video_id uuid,
    suggested_by public."suggestedBy" NOT NULL,
    suggested_time timestamp with time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: rate_limit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limit (
    id text NOT NULL,
    key text,
    count integer,
    last_request bigint
);


--
-- Name: school; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    address text,
    city text,
    prefecture text,
    website_url text,
    email text,
    image_url text,
    support_international_students boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    id text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL
);


--
-- Name: student_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_profile (
    user_id text NOT NULL,
    bio text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    image_url text DEFAULT 'https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sHfAviE2zasoidYb10Mu7JGNQFZWgVmCrRHPE'::text,
    favorite_destination text[],
    district character varying(30),
    phone_number character varying(30),
    sex public.sex,
    city character varying(30)
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified boolean NOT NULL,
    image text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    role public.role DEFAULT 'none'::public.role
);


--
-- Name: verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: video_call; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.video_call (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id text NOT NULL,
    mentor_id text NOT NULL,
    scheduled_time timestamp without time zone,
    payment_id uuid,
    start_url text,
    join_url text,
    status public.video_call_status DEFAULT 'pending'::public.video_call_status,
    zoom_meeting_id text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) FROM stdin;
zZNPY8TEk4WjbrduFkVTLN6wJ46yfjwd	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	credential	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	\N	\N	\N	\N	\N	\N	7c623c28bc0bb6371b6c6570dcf46bc8:ec88c63bfe8149801495b2be54c8787ba1fa0954d5fc20441fb2b7806fc9869319c609756d169949b357401c038f040429f0996b0ece0c4eeaede67abf1afb21	2025-08-13 12:09:38.946	2025-08-13 12:09:38.946
5LYob2TXDWKfITykDvO2qCyDfQUCR4ef	aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1	credential	aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1	\N	\N	\N	\N	\N	\N	67686c8b87988b62fb271d09f830d2d7:096793847cfe846c32a23b5ff0cd444922ce44dc466a3cba67ee838e392dc992802ca5df1045fa5efafc65b93c604a2211566eb3b4815eb07b5b26bafe2dbcf8	2025-08-13 13:22:13.823	2025-08-13 13:22:13.823
vp2c6qaXVIUcUf6Lx0ZN550xkWoG1fGP	jzozQ60mxD05WMuqexpSj2okKPr6kqws	credential	jzozQ60mxD05WMuqexpSj2okKPr6kqws	\N	\N	\N	\N	\N	\N	099baf8f438cb50408121cd5279495b4:3630c991bc2c602b9e86cb167b9301446ad34a2e24977d89f5f166e7028386c83a73f8d1f0d7554eabcf17751e2f9148f484f61795c618b78e74eb234949ea34	2025-08-13 13:48:12.669	2025-08-13 13:48:12.669
YzzWLlhXomNIuTSulIyc7IAItnq6rYlJ	wbJKxeAztBiV5f7a9GTGq3ROTueOYLo5	credential	wbJKxeAztBiV5f7a9GTGq3ROTueOYLo5	\N	\N	\N	\N	\N	\N	75e6f45f9e541a83be54abe8297798a4:5fff3c0ea87f928934fd89d796149a5a2bb4bd81337ea841c491a8b86d511924313e0adcd11b2170a422478f35444775f02b6fec5dc7f938a2937a463fa5e9dd	2025-08-14 11:32:37.518	2025-08-14 11:32:37.518
MjmgFii8sfMYwKXo1U8jEGdeLZ3Cnzvy	IUw8ukwROjuC1ChGDaLXxANLZCN36mwE	credential	IUw8ukwROjuC1ChGDaLXxANLZCN36mwE	\N	\N	\N	\N	\N	\N	f6ef7eaae6e6138af46b59088778beec:a1dec4fe66f25ca3228442b36badf36dbb5a23fc508e73c60ca099af3982a8f6dcdbd2b297e3f15d760dec4b20a71563d0c83cf0aa3de5a7c0621c906c526e0d	2025-08-14 11:53:49.436	2025-08-14 11:53:49.436
RIAM1K8vL9gr1RoawZiLH6mSUT781MXv	xlek46nzTnfAyjDiVyTpNdZtJswJn5NU	credential	xlek46nzTnfAyjDiVyTpNdZtJswJn5NU	\N	\N	\N	\N	\N	\N	8c0ca1727156436c85eb21fcc1b4e29b:a70831dc3db8e64353016de703177b251b2ab67e27ca3affb22659b20b00cd219844d4e07f60af04b39a35e601e854f692083848c5042c768b127f5b8ee9a5a0	2025-08-14 11:57:04.763	2025-08-14 11:57:04.763
rHyTuFr6GsJ1B3UhWUoaf2ajS14BN7Kk	kE2AKWOp22omShGmoclIaC5vNbjjBzNi	credential	kE2AKWOp22omShGmoclIaC5vNbjjBzNi	\N	\N	\N	\N	\N	\N	2230bc603d16a74adbd2d49e6880e1fd:c9d0e26c6aa7e90b4ba79bf0246bcef1a05b2f87efd1c31d7300aed342f26f4278c8c7635b707a0c886c593839f96fcd286dca8a667a4533513cd1cc9c6db529	2025-08-21 15:48:54.04	2025-08-21 15:48:54.04
5UAyjkXxnKzzapwpIMpORI2YpCscGNkM	rVHUsEMdwRdCwZn2DopfRnf4w8K7Mzzn	credential	rVHUsEMdwRdCwZn2DopfRnf4w8K7Mzzn	\N	\N	\N	\N	\N	\N	f488dc10334beecf31d27e7b492d6a3b:61aa119a5645e2ba327954cef8f3f842888ae793d0ecc2a8138d1308467d4c09f26b51d70ae3f5bec9a35a47f16a7d8f1492fb674c005f9c83219b9c9e3ba8cc	2025-07-24 08:04:26.701	2025-07-24 08:04:26.701
U5tIaKHAQu4v5157oPKLZkD8TEZh66Ed	bGnz4All0qqxdOUCTZljGlLU73cs3xgf	credential	bGnz4All0qqxdOUCTZljGlLU73cs3xgf	\N	\N	\N	\N	\N	\N	687f9ad9276ba141ddb3512cedc99627:83dc8461575c1c5a56d489af2e5e6ca3a61ef88eaedb70a5d0a178f056fd7a782d40f434bdce246f9868b4ee315155013aeb373c75df753f9e4429267c7f1127	2025-08-30 06:49:22.849	2025-08-30 06:49:22.849
ndfEUdcO8daQfe992QseQmbfpmV7S4Ts	9f8dQuAVn69KmHd1MFu4b1TgAXFcx9F1	credential	9f8dQuAVn69KmHd1MFu4b1TgAXFcx9F1	\N	\N	\N	\N	\N	\N	a27cb0e5329784a85b4997aef7c9c009:1e67c2cde3ae7c8959af350ab6bdf2f903a3340a35429c36792f8f1ab52f78fc98ca9c9e61a011af36fac94a73c5a83a889aa274275fcfcca0e9e52c0d66a4b2	2025-07-23 10:09:25.666	2025-07-23 10:09:25.666
2r1k2FIztazt3HmK7M57oq0UVBrX61eG	cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue	credential	cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue	\N	\N	\N	\N	\N	\N	0d518d87bdf783908cc6e8b202ce8bb0:9ddbe72a5a9ac50df00d866fe5baa2d7ced991aa350e5ec44c959e37aa3ddcaf00e5405a03030c78a5b266303e68ea390af17c89bc7044ef2aee678d59c43d41	2025-07-23 09:57:11.585	2025-07-23 09:57:11.585
QKvs5KwBd4VhIG6dvRcDbhE9ipL2aLPA	IG690sdJCib7RgOjkAN1uoWii2wUApke	credential	IG690sdJCib7RgOjkAN1uoWii2wUApke	\N	\N	\N	\N	\N	\N	ec11dfe5c89f2b7399159eec82063f20:00f96ea8fd7e586a5348ca5718ac05be2d9769d15b09bc9503404b8a767fa3af4a9b1fb0164b2b01f628a6ed1368d52e12067e07bdd11c66ebc9a3753d4075cb	2025-07-26 08:30:22.833	2025-07-26 08:30:22.833
yayJjwOavaypndDCjhklPbW3KEs1Xpbq	kXdP8g07wSQcS0yinpELQRVQGxZ3V9ro	credential	kXdP8g07wSQcS0yinpELQRVQGxZ3V9ro	\N	\N	\N	\N	\N	\N	f1aef0e4cd042aed39505a3440bdbe15:df6bce6a71a1c7d7ab52e322dd2fc02412f65c6d5c55c4767488a392e722f1638fb5a9baf51ea82e917e7709064038c8282f2ddc10be342bf0ca81cec9d97cba	2025-07-24 10:11:35.699	2025-07-24 10:11:35.699
\.


--
-- Data for Name: chat_subscription; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_subscription (id, student_id, mentor_id, payment_id, start_date, end_date, status, created_at, updated_at) FROM stdin;
6d081e52-5c4f-46d8-8025-6eeec8f6eca7	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue	92d5558c-42cd-467a-9534-fd2b4b5a032e	2025-09-04 09:51:29.256	2025-10-04 09:51:29.256	active	2025-09-04 09:51:30.665178	2025-09-04 09:51:30.665178
\.


--
-- Data for Name: favorite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorite (id, student_id, mentor_id, created_at) FROM stdin;
37a76f38-925a-4701-873e-851646781081	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue	2025-08-30 07:23:41.147
\.


--
-- Data for Name: mentor_profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mentor_profile (user_id, country, city, zip_code, phone_number, nationality, sex, resume, citizenship_photo_url, image_url, verified_status, "createdAt", "updatedAt", bio) FROM stdin;
cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue	nepal	kathmandu	3211	1234567890	nepalese	male	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1stXRQy9KUCSmf79cqgixKay0HIzuQw8PAhVBn	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sCEeQDjf0eNXstnBU7Wroyd5T2FcAqDQxpbvP	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sln9kwtNFKXRzuUphGPcAWk4mLa85YibMFtwN	accepted	2025-07-24 06:05:51.679	2025-07-27 10:28:26.373	I want to be a mentor!
bGnz4All0qqxdOUCTZljGlLU73cs3xgf	nepal	butwal	3211	1234567890	nepalese	male	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sRRILEhXbtMjm50ns8396QYGuFZpz1dXwhKVk	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sPk22hyxxsvBJVLUIMlHNhQY1kzTwqRZXPc7G	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sZof9potglnwTSUeD8QxRWtyX3YJdkjrFCoAf	accepted	2025-08-30 06:51:28.492	2025-08-30 06:53:06.878	I want to be a mentor , accept my pending request boys!
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment (id, user_id, type, amount, currency, status, stripe_payment_id, stripe_subscription_id, created_at, updated_at) FROM stdin;
f6e5a2de-8610-4046-8e94-008572eeba3b	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	chat_subscription	1000	USD	paid	\N	sub_1S1UUHK7iqSqBbK4RQAwE0Lb	2025-08-29 15:45:18.348626	2025-08-29 15:45:18.348626
79eb27a5-7311-4f58-89c4-a07901b4ee03	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	chat_subscription	1000	USD	paid	\N	sub_1S1iknK7iqSqBbK4WB7d9DSk	2025-08-30 06:59:18.996564	2025-08-30 06:59:18.996564
1cbd5288-6cca-4c7f-9b08-acadc33eb2fa	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	chat_subscription	1000	USD	paid	\N	sub_1S1ioFK7iqSqBbK4E1cPEyqo	2025-08-30 07:02:49.872769	2025-08-30 07:02:49.872769
c12ffb23-9f57-4b3f-b41d-1ea078387787	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	video_call	500	USD	paid	pi_3S1jAOK7iqSqBbK41aorXf6P	\N	2025-08-30 07:25:43.916117	2025-08-30 07:25:43.916117
288334dd-59f0-49c9-b8f2-7a6e4d91e040	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	video_call	500	USD	paid	pi_3S1jpsK7iqSqBbK41Xqf2uWv	\N	2025-08-30 08:08:35.936142	2025-08-30 08:08:35.936142
92d5558c-42cd-467a-9534-fd2b4b5a032e	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	chat_subscription	1000	USD	paid	\N	sub_1S3Zp9K7iqSqBbK4tQjnJMEV	2025-09-04 09:51:28.986612	2025-09-04 09:51:28.986612
aaa08d38-d909-4088-8c31-662cc4bb94d1	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	video_call	500	USD	paid	pi_3S3Zq7K7iqSqBbK40KBt1kJ3	\N	2025-09-04 09:52:26.875344	2025-09-04 09:52:26.875344
c101d261-f57a-4c2c-950a-3066aba75593	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	video_call	500	USD	paid	pi_3S6Sj4K7iqSqBbK41EfTawor	\N	2025-09-12 08:53:08.243072	2025-09-12 08:53:08.243072
\.


--
-- Data for Name: preferred_time; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.preferred_time (id, video_id, student_preferred_time, mentor_preferred_time, status, created_at, updated_at) FROM stdin;
ed4c1313-1cf8-4d53-ae08-91cf145e01ff	fc2c395a-87c4-4769-9151-40662d0a1659	2025-09-13 05:00:00+00	\N	pending	2025-09-13 06:32:30.922804	2025-09-13 06:32:30.922804
ea7dbf41-5f02-4174-93e3-e008b29b1fa1	9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	2025-09-15 04:45:00+00	2025-09-15 04:45:00+00	accepted	2025-09-13 08:49:27.628513	2025-09-15 10:19:18.616
\.


--
-- Data for Name: preferred_time_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.preferred_time_log (id, video_id, suggested_by, suggested_time, created_at) FROM stdin;
4dfb50db-8b24-4ffa-8512-44b27c866d6e	9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	student	2025-09-27 04:45:00+00	2025-09-13 08:25:12.933907
5aae94ba-5908-49fa-8e4c-e34f4d8eced4	9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	student	2025-09-27 04:45:00+00	2025-09-13 08:26:24.88766
8b40f114-ef32-4fee-83b6-6e542d2f0fc0	9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	student	2025-10-01 04:45:00+00	2025-09-13 08:49:25.323486
87359658-7660-4f12-9044-b067aa80d955	9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	mentor	2025-09-14 04:45:00+00	2025-09-14 14:47:40.030979
4b727de0-a90a-42f1-9796-683cc3ce998a	9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	mentor	2025-09-14 04:45:00+00	2025-09-14 14:47:57.233054
435ca435-713b-47fc-993c-aaa3e1df5f52	9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	mentor	2025-09-15 04:45:00+00	2025-09-15 10:19:17.97949
\.


--
-- Data for Name: rate_limit; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rate_limit (id, key, count, last_request) FROM stdin;
resend-verification:SPpywDDXqnE5dEGAfHvSnRwGRrblWpVt	resend-verification:SPpywDDXqnE5dEGAfHvSnRwGRrblWpVt	3	1753869676560
reset-password-link:noob@gmail.com	reset-password-link:noob@gmail.com	3	1753873722819
resend-verification:IUw8ukwROjuC1ChGDaLXxANLZCN36mwE	resend-verification:IUw8ukwROjuC1ChGDaLXxANLZCN36mwE	3	1755173203234
wF6Sf9liSvi9Z2ch6mTjn8nFAjqiY6Dw	104.28.228.87/sign-out	1	1755516663965
omEFSia03yKZR8zA5qs8Lt3zbgIbVKxd	103.182.174.54/sign-out	1	1755791169376
MwrLGt9UGZzSHKLcLLZql7NDkw0WvEFQ	103.121.172.26/verify-email	1	1755791360711
reset-password-link:slashop12@gmail.com	reset-password-link:slashop12@gmail.com	3	1755863790401
reset-password-link:suprimkhatri17@gmail.com	reset-password-link:suprimkhatri17@gmail.com	3	1755869401664
reset-password-link:	reset-password-link:	1	1755869433639
\.


--
-- Data for Name: school; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.school (id, name, address, city, prefecture, website_url, email, image_url, support_international_students, created_at, updated_at) FROM stdin;
a42108f6-1b02-4dac-89b1-732ee4b8202f	Akamonkai Japanese Language School	6-39-12 Higashi-Nippori, Arakawa-ku, Tokyo 116-0014, Japan	Tokyo	Tokyo	https://www.akamonkai.ac.jp/english/	support@akamonkai.ac.jp	https://logo.clearbit.com/akamonkai.ac.jp	t	2025-08-26 07:02:17.737635	2025-08-26 07:02:17.737635
e56979fd-7cdf-4e2e-9557-a0d9d4e13aa5	KAI Japanese Language School	1-15-18 Takadanobaba, Shinjuku-ku, Tokyo 169-0075, Japan	Tokyo	Tokyo	https://www.kaij.jp/english/	admission@kaij.co.jp	https://logo.clearbit.com/kaij.jp	t	2025-08-26 07:07:59.351693	2025-08-26 07:07:59.351693
d73cdcd6-21f6-4b1a-b4e2-627e80c53bad	Shinjuku Japanese Language Institute (SNG)	2-29-9 Takadanobaba, Shinjuku-ku, Tokyo 169-0075, Japan	Tokyo	Tokyo	https://www.sng.ac.jp/en/	snginfo@sng.ac.jp	https://logo.clearbit.com/sng.ac.jp	t	2025-08-26 07:11:21.051243	2025-08-26 07:11:21.051243
2b4e06e2-5382-49b5-a64e-3b9ea7629125	Tokyo Central Japanese Language School (TCJ)	3-6-7 Shinanomachi, Shinjuku-ku, Tokyo 160-0016, Japan	Tokyo	Tokyo	https://tcj-education.com/en/	info@tcj-nihongo.com	https://logo.clearbit.com/tcj-education.com	t	2025-08-26 07:12:25.775573	2025-08-26 07:12:25.775573
54a7ec89-0bd4-4140-9bae-7b23e3048262	GenkiJACS – Tokyo	Hanazono Building B1F, 5-17-6 Shinjuku, Shinjuku-ku, Tokyo 160-0022, Japan	Tokyo	Tokyo	https://www.genkijacs.com/tokyo-access.php	tokyo@genkijacs.com	https://logo.clearbit.com/genkijacs.com	t	2025-08-26 07:22:30.580767	2025-08-26 07:22:30.580767
cd1eef56-78e5-4221-8a5f-1a5524abcd8f	The Naganuma School – Tokyo School of Japanese Language	16-26 Nampeidai-cho, Shibuya-ku, Tokyo 150-0036, Japan	Tokyo	Tokyo	https://www.naganuma-school.ac.jp/	info@naganuma-school.ac.jp	https://logo.clearbit.com/naganuma-school.ac.jp	t	2025-08-26 07:23:46.274891	2025-08-26 07:23:46.274891
2978da85-d330-4464-85e3-43007bbce7e4	Sendagaya Japanese Institute (SJI)	1-1-6 Shimoochiai, Shinjuku-ku, Tokyo 161-0033, Japan	Tokyo	Tokyo	https://group.jp-sji.org/en/	info@jp-sji.org	https://logo.clearbit.com/jp-sji.org	t	2025-08-26 07:24:13.913897	2025-08-26 07:24:13.913897
9600bd61-4137-4e97-a310-6889660b8a31	Kudan Institute of Japanese Language & Culture	2-7-10 Kanda Misaki-cho, Chiyoda-ku, Tokyo 101-0061, Japan	Tokyo	Tokyo	https://www.kudan-japanese-school.com/en/	info@kudan-japanese-school.com	https://logo.clearbit.com/kudan-japanese-school.com	t	2025-08-26 07:24:46.018988	2025-08-26 07:24:46.018988
78282c24-ae72-4199-99fa-3217f58746f0	ARC Academy Tokyo (Iidabashi)	2-23-10 Koraku, Bunkyo-ku, Tokyo 112-0004, Japan	Tokyo	Tokyo	https://www.arc-academy.net/english/schools/tokyo/	tokyo@arc.ac.jp	https://logo.clearbit.com/arc-academy.net	t	2025-08-26 07:25:13.30538	2025-08-26 07:25:13.30538
d2e06f32-18bb-421a-ae0c-82e7089b27e4	JCLI Japanese Language School	8-4-1 Toshima, Kita-ku, Tokyo 114-0003, Japan	Tokyo	Tokyo	https://jcli.ac.jp/en/	jcli@jclischool.com	https://logo.clearbit.com/naganuma-school.ac.jp	t	2025-08-26 07:23:05.600713	2025-08-26 07:23:05.600713
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) FROM stdin;
hBg0HYHpnqjgVwH4ARhSbqWclHsSN8IH	2025-08-05 08:22:58.985	cP2tMXo6xMe0Cn0PXBvNFSMkZAv1iqHs	2025-07-27 11:24:37.966	2025-07-29 08:22:58.985			kXdP8g07wSQcS0yinpELQRVQGxZ3V9ro
OTw94qynpgpXJR7jfu2niJU1d4C8VlmX	2025-08-11 14:22:48.034	z0VEREWD4rna7lzfxkrSiaZHvN9wUpgp	2025-08-04 14:22:48.035	2025-08-04 14:22:48.035			9f8dQuAVn69KmHd1MFu4b1TgAXFcx9F1
TarD9VcQSW8E7BwVFzb4vN9UUk3GY8Pi	2025-08-20 12:46:01.991	Z91XsU2cRYhKq9b1r8YrvkumG1jJT0vx	2025-08-13 12:46:01.992	2025-08-13 12:46:01.992		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv
IIvBQ1lBglaoz9nYxyQg722mjeM8o9e8	2025-08-20 13:22:13.839	s2AF4YTjXKMI3yf8uABMi523iNtzsLGy	2025-08-13 13:22:13.839	2025-08-13 13:22:13.839			aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1
OjdQyMTvoYJAsaSAEluqoRJXavEkcLMw	2025-08-20 13:31:23.26	A3FEeYa7oUMlfDA7cf3VycxH51GGFhye	2025-08-13 13:31:23.262	2025-08-13 13:31:23.262			IG690sdJCib7RgOjkAN1uoWii2wUApke
LnLZ3A7tFGRPxckZFz7nKRZ07C7LJgw6	2025-08-20 13:38:05.514	UJKRvcW4kmgAKO2O2IgmcVcX9OhKljd0	2025-08-13 13:38:05.515	2025-08-13 13:38:05.515		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1
xb5iFveH5hJfHEX2jNSxgnpYpHsT958x	2025-08-20 13:43:39.218	Nj5BDwXvJ0KwNkWFaXXQQ5ZiccP69Vui	2025-08-13 13:43:39.218	2025-08-13 13:43:39.218			aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1
CQ5xpN9j4ZY3hckkrQg01Cg0iXHHBM9i	2025-07-31 06:31:21.948	Jum5vekJ8muaESjPygcV2Sxcr2p3VBmU	2025-07-24 06:31:21.95	2025-07-24 06:31:21.95			cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue
DiwcLAOIFpM93U0ra19kdvig2Q80wGnz	2025-07-31 08:04:27.046	wkuJkj21zOfmlKRdkTtNhae3P51yeimQ	2025-07-24 08:04:27.046	2025-07-24 08:04:27.046			rVHUsEMdwRdCwZn2DopfRnf4w8K7Mzzn
ehYekFS43bHjV0iSYpyjekeOdVOhXolG	2025-08-20 13:48:33.778	qD9wMxTCaEnlxcrb20VMqABJgB02nIog	2025-08-13 13:48:33.779	2025-08-13 13:48:33.779		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	jzozQ60mxD05WMuqexpSj2okKPr6kqws
gUWWtpvrRXZwXwNPKlyhoutetBnVBFPV	2025-08-21 11:32:37.536	xLkMkzEutTmAZ5vg3aI0BmpkuzxjZCBe	2025-08-14 11:32:37.536	2025-08-14 11:32:37.536			wbJKxeAztBiV5f7a9GTGq3ROTueOYLo5
QacMPZVIIAnQ5Ru06obr7Ej5NULZWxDb	2025-07-31 10:11:36.076	kDx7vbfKY8HgwxumsyJwBksnDfooVT1r	2025-07-24 10:11:36.076	2025-07-24 10:11:36.076			kXdP8g07wSQcS0yinpELQRVQGxZ3V9ro
kHyBofA0pJePF4qlJJh45JNggIFyMq6C	2025-08-21 11:53:49.459	MwjbgjTdFiiIQJg4vFQnEYCNefrYdeLn	2025-08-14 11:53:49.459	2025-08-14 11:53:49.459			IUw8ukwROjuC1ChGDaLXxANLZCN36mwE
os3OlZ5JOSJgp7qwZl3IyRXI1wjUHs3X	2025-08-21 11:57:04.77	xwTjMV4cE43S0Tm4nwa5ajWB7bKluAgS	2025-08-14 11:57:04.77	2025-08-14 11:57:04.77			xlek46nzTnfAyjDiVyTpNdZtJswJn5NU
61sR1JTt5paPEMDi4SOWft7jBvwEOx0e	2025-07-31 17:03:06.294	uqZJd9rRkQHfjDgUdxxWE4LxTovzfmK7	2025-07-24 17:03:06.295	2025-07-24 17:03:06.295			cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue
LbpRuC53BIwiReF7axPdxJUphopVZ2lw	2025-08-24 10:26:05.678	4F2ygt5sL8v5Vzu0vldKhKqZPJ3JQdte	2025-08-13 13:23:55.895	2025-08-17 10:26:05.678		Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1
AvbBjpNpJeEiRpMTAwllKmXQSYMxgIaY	2025-08-25 11:16:12.126	CqH2apbMct3PEJqjk7ZkRUyfGzt8ivNY	2025-08-18 11:16:12.127	2025-08-18 11:16:12.127			UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv
wqkLDY9IOMqn14KLe7RUzpjU1qnGJFBD	2025-09-02 13:59:30.631	qNn4D0P5SKxq5YQQB1pc2rcllMrxEVpS	2025-08-21 15:47:41.178	2025-08-26 13:59:30.631			jzozQ60mxD05WMuqexpSj2okKPr6kqws
bUb2IckCqQZg5L7868jOhQcT6QIxr5iR	2025-09-19 08:27:48.334	BL3WDBy3XJB9gbEpteCf8lOcvUAFpifi	2025-09-05 08:46:58.104	2025-09-12 08:27:48.334			UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv
x0hliYUB14Z4FzRGIUmmXRJ35zteTbo0	2025-09-01 11:27:11.828	hL0C0dSg9WXW7Zy0rJFIjPqWfv941De1	2025-08-21 15:48:54.053	2025-08-25 11:27:11.828			kE2AKWOp22omShGmoclIaC5vNbjjBzNi
VcGjX2HHXscOpnQeWOOuLh5B1qvYlYuS	2025-08-02 08:30:23.162	l5OD0QTA3GTWIip11BnI8pEIlm5R4db7	2025-07-26 08:30:23.163	2025-07-26 08:30:23.163			IG690sdJCib7RgOjkAN1uoWii2wUApke
XuQ9EuYNLvrNERDqBtbqirpi4tVwT2qH	2025-08-02 08:33:19.42	xCq3iNhQvZ4wGvX6glHAtQGOPhLCsMQ8	2025-07-26 08:33:19.42	2025-07-26 08:33:19.42			IG690sdJCib7RgOjkAN1uoWii2wUApke
UWBIhXyyHAbsLqILL8Q526scXzBxnFZR	2025-09-06 05:16:34.428	4dbG1wgNmSdtStOYDS83ULnKFAKGVw92	2025-08-25 12:50:48.783	2025-08-30 05:16:34.428			rVHUsEMdwRdCwZn2DopfRnf4w8K7Mzzn
n1MsPmkB9qc9HScJBVLNHHHqCS3V4k2l	2025-09-22 09:56:22.069	R9gVOewMaZv7ZbNpdsADD1zeEUWkLecD	2025-09-14 09:52:38.452	2025-09-15 09:56:22.069			cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue
\.


--
-- Data for Name: student_profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_profile (user_id, bio, created_at, updated_at, image_url, favorite_destination, district, phone_number, sex, city) FROM stdin;
kXdP8g07wSQcS0yinpELQRVQGxZ3V9ro	Hello brother how are you. ..........................................................................	2025-07-27 11:39:18.458	2025-07-27 11:39:18.458	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sZWNT0qtglnwTSUeD8QxRWtyX3YJdkjrFCoAf	{}	Rupandehi	9876543210	male	beijing
UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	just some bs	2025-08-13 12:10:54.128	2025-08-13 12:10:54.128	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sb3sZlye914fshqY6UwHe8D7pKxNaWjJdi0gu	{nepal,japan}	linegayodehi	98000000000	male	linegayotwal
aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1	Jdjbsbs s hehdhshjse jsjsjsnsj bsjsjjsjd jejdjsnsjsj jsjsjsnsj jdjsjsnnd	2025-08-13 13:25:35.221	2025-08-13 13:25:35.221	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sovBBNMZ5EYzhS1gfFDe2si9B0PGWQOljCnxb	{japan}	rupandehi	9800000000	male	butwal
jzozQ60mxD05WMuqexpSj2okKPr6kqws	Hi it's me bishal	2025-08-13 13:50:04.81	2025-08-13 13:50:04.81	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sYUXBwZkdo13DZjVzHyiXYGP0AqQtvcNJfUeR	{"korea, democratic people's republic of",japan,"united arab emirates",armenia}	rupandehi	9765314707	male	butwal
kE2AKWOp22omShGmoclIaC5vNbjjBzNi	404!	2025-08-21 15:53:52.87	2025-08-21 15:53:52.87	https://vbteadl6m3.ufs.sh/f/DDJ5nPL6Yp1sCYGMpCf0eNXstnBU7Wroyd5T2FcAqDQxpbvP	{andorra,afghanistan}	nawalparasi	9800000000	male	sunwal
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, name, email, email_verified, image, created_at, updated_at, role) FROM stdin;
jzozQ60mxD05WMuqexpSj2okKPr6kqws	Magar Bishal	magardadi5@gmail.com	t	\N	2025-08-13 13:48:12.65	2025-08-13 13:48:12.65	student
wbJKxeAztBiV5f7a9GTGq3ROTueOYLo5	Roshan Pokharel	john.doe@example.co.uk	f	\N	2025-08-14 11:32:37.492	2025-08-14 11:32:37.492	student
IUw8ukwROjuC1ChGDaLXxANLZCN36mwE	Roshan POkharle	user@vsdfa.com	f	\N	2025-08-14 11:53:49.399	2025-08-14 11:53:49.399	student
xlek46nzTnfAyjDiVyTpNdZtJswJn5NU	Roshan Pokharel	email@gmail.com	f	\N	2025-08-14 11:57:04.738	2025-08-14 11:57:04.738	student
kE2AKWOp22omShGmoclIaC5vNbjjBzNi	Jeevan Kami	digitaljeevan6@gmail.com	t	\N	2025-08-21 15:48:54.021	2025-08-21 15:48:54.021	student
cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue	suprim khatri	slashop12@gmail.com	t	\N	2025-07-23 09:57:10.59	2025-07-23 09:57:10.59	mentor
bGnz4All0qqxdOUCTZljGlLU73cs3xgf	mentor suprim	suprim.dev77@gmail.com	t	\N	2025-08-30 06:49:21.377	2025-08-30 06:49:21.377	mentor
9f8dQuAVn69KmHd1MFu4b1TgAXFcx9F1	nepali pool	nepalipool77@gmail.com	t	\N	2025-07-23 10:09:24.842	2025-07-23 10:09:24.842	admin
rVHUsEMdwRdCwZn2DopfRnf4w8K7Mzzn	Chan Antony	chanantony29@gmail.com	t	\N	2025-07-24 08:04:25.165	2025-07-24 08:04:25.165	admin
kXdP8g07wSQcS0yinpELQRVQGxZ3V9ro	Code Blood	codeblood94@gmail.com	t	\N	2025-07-24 10:11:34.162	2025-07-24 10:11:34.162	student
IG690sdJCib7RgOjkAN1uoWii2wUApke	Bishal Magar	bishalm626@gmail.com	t	\N	2025-07-26 08:30:21.316	2025-07-26 08:30:21.316	admin
UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	suprim fromProduction	suprimkhatri17@gmail.com	t	\N	2025-08-13 12:09:38.908	2025-08-13 12:09:38.908	student
aq7zjxCJrXqDAniGZNUKbrLz1fbuZ5i1	Roshan Pokharel	inifinityzone229@gmail.com	t	\N	2025-08-13 13:22:13.777	2025-08-13 13:22:13.777	student
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification (id, identifier, value, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: video_call; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.video_call (id, student_id, mentor_id, scheduled_time, payment_id, start_url, join_url, status, zoom_meeting_id, created_at, updated_at) FROM stdin;
fc2c395a-87c4-4769-9151-40662d0a1659	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	bGnz4All0qqxdOUCTZljGlLU73cs3xgf	\N	c101d261-f57a-4c2c-950a-3066aba75593	\N	\N	pending	\N	2025-09-12 08:53:09.922724	2025-09-12 08:53:09.922724
9e0a9f80-6ba6-489b-9fc7-af06ea603bfd	UjWtRKnVHYMOwQfFNcsvi3BYLVSn6Nzv	cdVZz5Mu5mBxHN48J0fnAnGQfOFwRAue	2025-09-15 04:45:00	aaa08d38-d909-4088-8c31-662cc4bb94d1	test-start-url	test-join-url	scheduled	test-zoom-meeting-id	2025-09-04 09:52:28.512561	2025-09-04 09:55:36.708
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: chat_subscription chat_subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_subscription
    ADD CONSTRAINT chat_subscription_pkey PRIMARY KEY (id);


--
-- Name: favorite favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_pkey PRIMARY KEY (id);


--
-- Name: mentor_profile mentor_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_profile
    ADD CONSTRAINT mentor_profile_pkey PRIMARY KEY (user_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: preferred_time preferred_table_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferred_time
    ADD CONSTRAINT preferred_table_pkey PRIMARY KEY (id);


--
-- Name: preferred_time_log preferred_time_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferred_time_log
    ADD CONSTRAINT preferred_time_log_pkey PRIMARY KEY (id);


--
-- Name: rate_limit rate_limit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limit
    ADD CONSTRAINT rate_limit_pkey PRIMARY KEY (id);


--
-- Name: school school_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school
    ADD CONSTRAINT school_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_unique UNIQUE (token);


--
-- Name: student_profile student_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profile
    ADD CONSTRAINT student_profile_pkey PRIMARY KEY (user_id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: video_call video_call_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_call
    ADD CONSTRAINT video_call_pkey PRIMARY KEY (id);


--
-- Name: unique_active_chat; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_active_chat ON public.chat_subscription USING btree (student_id, mentor_id, status);


--
-- Name: unique_student_mentor; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_student_mentor ON public.favorite USING btree (student_id, mentor_id);


--
-- Name: unique_video_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_video_id ON public.preferred_time USING btree (video_id);


--
-- Name: account account_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: chat_subscription chat_subscription_mentor_id_mentor_profile_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_subscription
    ADD CONSTRAINT chat_subscription_mentor_id_mentor_profile_user_id_fk FOREIGN KEY (mentor_id) REFERENCES public.mentor_profile(user_id) ON DELETE CASCADE;


--
-- Name: chat_subscription chat_subscription_payment_id_payment_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_subscription
    ADD CONSTRAINT chat_subscription_payment_id_payment_id_fk FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON DELETE CASCADE;


--
-- Name: chat_subscription chat_subscription_student_id_student_profile_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_subscription
    ADD CONSTRAINT chat_subscription_student_id_student_profile_user_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profile(user_id) ON DELETE CASCADE;


--
-- Name: favorite favorite_mentor_id_mentor_profile_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_mentor_id_mentor_profile_user_id_fk FOREIGN KEY (mentor_id) REFERENCES public.mentor_profile(user_id) ON DELETE CASCADE;


--
-- Name: favorite favorite_student_id_student_profile_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorite
    ADD CONSTRAINT favorite_student_id_student_profile_user_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profile(user_id) ON DELETE CASCADE;


--
-- Name: mentor_profile mentor_profile_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_profile
    ADD CONSTRAINT mentor_profile_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: payment payment_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: preferred_time_log preferred_time_log_video_id_video_call_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferred_time_log
    ADD CONSTRAINT preferred_time_log_video_id_video_call_id_fk FOREIGN KEY (video_id) REFERENCES public.video_call(id);


--
-- Name: preferred_time preferred_time_video_id_video_call_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferred_time
    ADD CONSTRAINT preferred_time_video_id_video_call_id_fk FOREIGN KEY (video_id) REFERENCES public.video_call(id) ON DELETE CASCADE;


--
-- Name: session session_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: student_profile student_profile_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_profile
    ADD CONSTRAINT student_profile_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: video_call video_call_mentor_id_mentor_profile_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_call
    ADD CONSTRAINT video_call_mentor_id_mentor_profile_user_id_fk FOREIGN KEY (mentor_id) REFERENCES public.mentor_profile(user_id) ON DELETE CASCADE;


--
-- Name: video_call video_call_payment_id_payment_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_call
    ADD CONSTRAINT video_call_payment_id_payment_id_fk FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON DELETE CASCADE;


--
-- Name: video_call video_call_student_id_student_profile_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_call
    ADD CONSTRAINT video_call_student_id_student_profile_user_id_fk FOREIGN KEY (student_id) REFERENCES public.student_profile(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Qey8RDiUfG0ehzWand4fXqGM83goxJi7fNeOZmLmtHiaKRk2eAzM4fOyFyCmm6o

