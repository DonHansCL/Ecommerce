PGDMP      6                 }        	   ecommerce    16.4    16.4 Q    j           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            k           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            l           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            m           1262    33322 	   ecommerce    DATABASE     |   CREATE DATABASE ecommerce WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE ecommerce;
                postgres    false            l           1247    33379    enum_Pedidos_estado    TYPE     f   CREATE TYPE public."enum_Pedidos_estado" AS ENUM (
    'pendiente',
    'enviado',
    'entregado'
);
 (   DROP TYPE public."enum_Pedidos_estado";
       public          postgres    false            �           1247    33623    enum_Usuarios_rol    TYPE     p   CREATE TYPE public."enum_Usuarios_rol" AS ENUM (
    'cliente',
    'administrador',
    'cliente_bloqueado'
);
 &   DROP TYPE public."enum_Usuarios_rol";
       public          postgres    false            �            1259    33352    Carritos    TABLE     U   CREATE TABLE public."Carritos" (
    id integer NOT NULL,
    "usuarioId" integer
);
    DROP TABLE public."Carritos";
       public         heap    postgres    false            �            1259    33351    Carritos_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Carritos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Carritos_id_seq";
       public          postgres    false    230            n           0    0    Carritos_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Carritos_id_seq" OWNED BY public."Carritos".id;
          public          postgres    false    229            �            1259    33363 	   CartItems    TABLE     �   CREATE TABLE public."CartItems" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL
);
    DROP TABLE public."CartItems";
       public         heap    postgres    false            �            1259    33597 
   Categorias    TABLE     �   CREATE TABLE public."Categorias" (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    imagen character varying(255) DEFAULT ''::character varying
);
     DROP TABLE public."Categorias";
       public         heap    postgres    false            �            1259    33596    Categorias_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Categorias_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Categorias_id_seq";
       public          postgres    false    239            o           0    0    Categorias_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Categorias_id_seq" OWNED BY public."Categorias".id;
          public          postgres    false    238            �            1259    33426    ItemsCarrito    TABLE     �   CREATE TABLE public."ItemsCarrito" (
    id integer NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    "carritoId" integer,
    "productoId" integer,
    "ProductId" integer
);
 "   DROP TABLE public."ItemsCarrito";
       public         heap    postgres    false            �            1259    33425    ItemsCarrito_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ItemsCarrito_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."ItemsCarrito_id_seq";
       public          postgres    false    236            p           0    0    ItemsCarrito_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."ItemsCarrito_id_seq" OWNED BY public."ItemsCarrito".id;
          public          postgres    false    235            �            1259    33398 
   OrderItems    TABLE     �   CREATE TABLE public."OrderItems" (
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    precio numeric(10,2) NOT NULL
);
     DROP TABLE public."OrderItems";
       public         heap    postgres    false            �            1259    33778    PedidoItems    TABLE     �   CREATE TABLE public."PedidoItems" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    precio numeric(10,2) NOT NULL,
    "OrderId" integer
);
 !   DROP TABLE public."PedidoItems";
       public         heap    postgres    false            �            1259    33777    PedidoItems_id_seq    SEQUENCE     �   CREATE SEQUENCE public."PedidoItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."PedidoItems_id_seq";
       public          postgres    false    245            q           0    0    PedidoItems_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."PedidoItems_id_seq" OWNED BY public."PedidoItems".id;
          public          postgres    false    244            �            1259    33386    Pedidos    TABLE     �  CREATE TABLE public."Pedidos" (
    id integer NOT NULL,
    "usuarioId" integer,
    total numeric(10,2) NOT NULL,
    estado character varying(255) NOT NULL,
    "direccionEnvio" character varying(255) NOT NULL,
    "metodoPago" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
    DROP TABLE public."Pedidos";
       public         heap    postgres    false            �            1259    33385    Pedidos_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Pedidos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Pedidos_id_seq";
       public          postgres    false    233            r           0    0    Pedidos_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Pedidos_id_seq" OWNED BY public."Pedidos".id;
          public          postgres    false    232            �            1259    33608 	   Productos    TABLE     B  CREATE TABLE public."Productos" (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    imagenes character varying(255)[],
    "cantidadEnStock" integer NOT NULL,
    "categoriaId" integer NOT NULL,
    featured boolean DEFAULT false NOT NULL
);
    DROP TABLE public."Productos";
       public         heap    postgres    false            �            1259    33607    Productos_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Productos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Productos_id_seq";
       public          postgres    false    241            s           0    0    Productos_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Productos_id_seq" OWNED BY public."Productos".id;
          public          postgres    false    240            �            1259    33443    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap    postgres    false            �            1259    33630    Usuarios    TABLE     G  CREATE TABLE public."Usuarios" (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    correo character varying(255) NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    rol public."enum_Usuarios_rol" DEFAULT 'cliente'::public."enum_Usuarios_rol",
    "fechaRegistro" timestamp with time zone
);
    DROP TABLE public."Usuarios";
       public         heap    postgres    false    897    897            �            1259    33629    Usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Usuarios_id_seq";
       public          postgres    false    243            t           0    0    Usuarios_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Usuarios_id_seq" OWNED BY public."Usuarios".id;
          public          postgres    false    242            �           2604    33355    Carritos id    DEFAULT     n   ALTER TABLE ONLY public."Carritos" ALTER COLUMN id SET DEFAULT nextval('public."Carritos_id_seq"'::regclass);
 <   ALTER TABLE public."Carritos" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229    230            �           2604    33600    Categorias id    DEFAULT     r   ALTER TABLE ONLY public."Categorias" ALTER COLUMN id SET DEFAULT nextval('public."Categorias_id_seq"'::regclass);
 >   ALTER TABLE public."Categorias" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    238    239    239            �           2604    33429    ItemsCarrito id    DEFAULT     v   ALTER TABLE ONLY public."ItemsCarrito" ALTER COLUMN id SET DEFAULT nextval('public."ItemsCarrito_id_seq"'::regclass);
 @   ALTER TABLE public."ItemsCarrito" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    236    236            �           2604    33781    PedidoItems id    DEFAULT     t   ALTER TABLE ONLY public."PedidoItems" ALTER COLUMN id SET DEFAULT nextval('public."PedidoItems_id_seq"'::regclass);
 ?   ALTER TABLE public."PedidoItems" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    244    245    245            �           2604    33389 
   Pedidos id    DEFAULT     l   ALTER TABLE ONLY public."Pedidos" ALTER COLUMN id SET DEFAULT nextval('public."Pedidos_id_seq"'::regclass);
 ;   ALTER TABLE public."Pedidos" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232    233            �           2604    33611    Productos id    DEFAULT     p   ALTER TABLE ONLY public."Productos" ALTER COLUMN id SET DEFAULT nextval('public."Productos_id_seq"'::regclass);
 =   ALTER TABLE public."Productos" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    241    240    241            �           2604    33633    Usuarios id    DEFAULT     n   ALTER TABLE ONLY public."Usuarios" ALTER COLUMN id SET DEFAULT nextval('public."Usuarios_id_seq"'::regclass);
 <   ALTER TABLE public."Usuarios" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    243    242    243            X          0    33352    Carritos 
   TABLE DATA           5   COPY public."Carritos" (id, "usuarioId") FROM stdin;
    public          postgres    false    230   8d       Y          0    33363 	   CartItems 
   TABLE DATA           V   COPY public."CartItems" ("createdAt", "updatedAt", "cartId", "productId") FROM stdin;
    public          postgres    false    231   ad       a          0    33597 
   Categorias 
   TABLE DATA           G   COPY public."Categorias" (id, nombre, descripcion, imagen) FROM stdin;
    public          postgres    false    239   ~d       ^          0    33426    ItemsCarrito 
   TABLE DATA           ^   COPY public."ItemsCarrito" (id, cantidad, "carritoId", "productoId", "ProductId") FROM stdin;
    public          postgres    false    236   oe       \          0    33398 
   OrderItems 
   TABLE DATA           P   COPY public."OrderItems" ("orderId", "productId", cantidad, precio) FROM stdin;
    public          postgres    false    234   �e       g          0    33778    PedidoItems 
   TABLE DATA           `   COPY public."PedidoItems" (id, "orderId", "productId", cantidad, precio, "OrderId") FROM stdin;
    public          postgres    false    245   �e       [          0    33386    Pedidos 
   TABLE DATA           }   COPY public."Pedidos" (id, "usuarioId", total, estado, "direccionEnvio", "metodoPago", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    233   f       c          0    33608 	   Productos 
   TABLE DATA           |   COPY public."Productos" (id, nombre, descripcion, precio, imagenes, "cantidadEnStock", "categoriaId", featured) FROM stdin;
    public          postgres    false    241   wf       _          0    33443    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public          postgres    false    237   �g       e          0    33630    Usuarios 
   TABLE DATA           ]   COPY public."Usuarios" (id, nombre, correo, "contraseña", rol, "fechaRegistro") FROM stdin;
    public          postgres    false    243   eh       u           0    0    Carritos_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Carritos_id_seq"', 3, true);
          public          postgres    false    229            v           0    0    Categorias_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Categorias_id_seq"', 7, true);
          public          postgres    false    238            w           0    0    ItemsCarrito_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."ItemsCarrito_id_seq"', 52, true);
          public          postgres    false    235            x           0    0    PedidoItems_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."PedidoItems_id_seq"', 8, true);
          public          postgres    false    244            y           0    0    Pedidos_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Pedidos_id_seq"', 6, true);
          public          postgres    false    232            z           0    0    Productos_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Productos_id_seq"', 13, true);
          public          postgres    false    240            {           0    0    Usuarios_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Usuarios_id_seq"', 5, true);
          public          postgres    false    242            �           2606    33357    Carritos Carritos_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Carritos"
    ADD CONSTRAINT "Carritos_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Carritos" DROP CONSTRAINT "Carritos_pkey";
       public            postgres    false    230            �           2606    33367    CartItems CartItems_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_pkey" PRIMARY KEY ("cartId", "productId");
 F   ALTER TABLE ONLY public."CartItems" DROP CONSTRAINT "CartItems_pkey";
       public            postgres    false    231    231            �           2606    33676     Categorias Categorias_nombre_key 
   CONSTRAINT     a   ALTER TABLE ONLY public."Categorias"
    ADD CONSTRAINT "Categorias_nombre_key" UNIQUE (nombre);
 N   ALTER TABLE ONLY public."Categorias" DROP CONSTRAINT "Categorias_nombre_key";
       public            postgres    false    239            �           2606    33678 !   Categorias Categorias_nombre_key1 
   CONSTRAINT     b   ALTER TABLE ONLY public."Categorias"
    ADD CONSTRAINT "Categorias_nombre_key1" UNIQUE (nombre);
 O   ALTER TABLE ONLY public."Categorias" DROP CONSTRAINT "Categorias_nombre_key1";
       public            postgres    false    239            �           2606    33604    Categorias Categorias_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Categorias"
    ADD CONSTRAINT "Categorias_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."Categorias" DROP CONSTRAINT "Categorias_pkey";
       public            postgres    false    239            �           2606    33432    ItemsCarrito ItemsCarrito_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."ItemsCarrito"
    ADD CONSTRAINT "ItemsCarrito_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."ItemsCarrito" DROP CONSTRAINT "ItemsCarrito_pkey";
       public            postgres    false    236            �           2606    33402    OrderItems OrderItems_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("orderId", "productId");
 H   ALTER TABLE ONLY public."OrderItems" DROP CONSTRAINT "OrderItems_pkey";
       public            postgres    false    234    234            �           2606    33784    PedidoItems PedidoItems_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY public."PedidoItems"
    ADD CONSTRAINT "PedidoItems_pkey" PRIMARY KEY (id, "orderId", "productId");
 J   ALTER TABLE ONLY public."PedidoItems" DROP CONSTRAINT "PedidoItems_pkey";
       public            postgres    false    245    245    245            �           2606    33786 -   PedidoItems PedidoItems_productId_OrderId_key 
   CONSTRAINT     ~   ALTER TABLE ONLY public."PedidoItems"
    ADD CONSTRAINT "PedidoItems_productId_OrderId_key" UNIQUE ("productId", "OrderId");
 [   ALTER TABLE ONLY public."PedidoItems" DROP CONSTRAINT "PedidoItems_productId_OrderId_key";
       public            postgres    false    245    245            �           2606    33392    Pedidos Pedidos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Pedidos"
    ADD CONSTRAINT "Pedidos_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Pedidos" DROP CONSTRAINT "Pedidos_pkey";
       public            postgres    false    233            �           2606    33616    Productos Productos_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Productos" DROP CONSTRAINT "Productos_pkey";
       public            postgres    false    241            �           2606    33447     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            postgres    false    237            �           2606    33661    Usuarios Usuarios_correo_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_correo_key" UNIQUE (correo);
 J   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_correo_key";
       public            postgres    false    243            �           2606    33663    Usuarios Usuarios_correo_key1 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_correo_key1" UNIQUE (correo);
 K   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_correo_key1";
       public            postgres    false    243            �           2606    33665    Usuarios Usuarios_correo_key2 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_correo_key2" UNIQUE (correo);
 K   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_correo_key2";
       public            postgres    false    243            �           2606    33638    Usuarios Usuarios_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Usuarios" DROP CONSTRAINT "Usuarios_pkey";
       public            postgres    false    243            �           2606    33668     Carritos Carritos_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Carritos"
    ADD CONSTRAINT "Carritos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public."Carritos" DROP CONSTRAINT "Carritos_usuarioId_fkey";
       public          postgres    false    243    4792    230            �           2606    33368    CartItems CartItems_cartId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CartItems"
    ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Carritos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."CartItems" DROP CONSTRAINT "CartItems_cartId_fkey";
       public          postgres    false    230    231    4766            �           2606    33684 (   ItemsCarrito ItemsCarrito_ProductId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ItemsCarrito"
    ADD CONSTRAINT "ItemsCarrito_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."ItemsCarrito" DROP CONSTRAINT "ItemsCarrito_ProductId_fkey";
       public          postgres    false    241    236    4784            �           2606    33691 (   ItemsCarrito ItemsCarrito_carritoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ItemsCarrito"
    ADD CONSTRAINT "ItemsCarrito_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES public."Carritos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."ItemsCarrito" DROP CONSTRAINT "ItemsCarrito_carritoId_fkey";
       public          postgres    false    230    4766    236            �           2606    33696 )   ItemsCarrito ItemsCarrito_productoId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ItemsCarrito"
    ADD CONSTRAINT "ItemsCarrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 W   ALTER TABLE ONLY public."ItemsCarrito" DROP CONSTRAINT "ItemsCarrito_productoId_fkey";
       public          postgres    false    236    241    4784            �           2606    33403 "   OrderItems OrderItems_orderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OrderItems"
    ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Pedidos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";
       public          postgres    false    4770    234    233            �           2606    33797 $   PedidoItems PedidoItems_OrderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."PedidoItems"
    ADD CONSTRAINT "PedidoItems_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Pedidos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."PedidoItems" DROP CONSTRAINT "PedidoItems_OrderId_fkey";
       public          postgres    false    4770    245    233            �           2606    33787 $   PedidoItems PedidoItems_orderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."PedidoItems"
    ADD CONSTRAINT "PedidoItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Pedidos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY public."PedidoItems" DROP CONSTRAINT "PedidoItems_orderId_fkey";
       public          postgres    false    233    4770    245            �           2606    33792 &   PedidoItems PedidoItems_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."PedidoItems"
    ADD CONSTRAINT "PedidoItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Productos"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."PedidoItems" DROP CONSTRAINT "PedidoItems_productId_fkey";
       public          postgres    false    4784    245    241            �           2606    33703    Pedidos Pedidos_usuarioId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Pedidos"
    ADD CONSTRAINT "Pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 L   ALTER TABLE ONLY public."Pedidos" DROP CONSTRAINT "Pedidos_usuarioId_fkey";
       public          postgres    false    4792    243    233            �           2606    33679 $   Productos Productos_categoriaId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES public."Categorias"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 R   ALTER TABLE ONLY public."Productos" DROP CONSTRAINT "Productos_categoriaId_fkey";
       public          postgres    false    4782    239    241            X      x�3�4�2�4�2�4����� A      Y      x������ � �      a   �   x�M�MJ�0�q��l���O�
D:�$�F�ܚ���%���W����ត��n@����G(5�!U�d�=��0#̨���X��4�R��	r6�5r�������,p.���K<�[F(m�f
���'��ΐ�sF��ښ犰��k�Pfp��n��$�z������$y.����#��p�So�u�B�=y�+������&-�^�*iO�m��X^�      ^      x������ � �      \      x������ � �      g   J   x�M���0Cѳ3L��4$K0A���P����Ā�`U�¼쐤ė�$$�dH���� ;:�X�E��pG���P �      [   d   x���K
�  ��x�.���Ql�5�	"ޟ<@��o�9�$p�~��G������a��*##�E�L�Uu%t(��-ʷz����0b�K�qٝ1���/�      c   K  x�u�AN�0E��)|�ǉ�dK׬��f��bp�(N�(�"�8 ��G�Ř4�R�%[c���$�VY�� Tz� �~���q��Zm��z��xm���T��4YӐ��st�ʫ�b�)���"-�&g�<{��`� ��&밙�P�p���ЛH;;�TO��f��;&�7��`z�1�!�g5茔��4\�:��(�ׂ��"ɺ�~螂7���L�n��"��,�7�ȥp
A��8X���
~bF�e
����4G���Y(#%Rp���F�+�#�stt�z:�e��.�ԟ�pj: h��pѺ�BT�̋��BVg����%I�����      _   �   x��̱�0�=���IU�:�!S�H,�1Ui�����H�x��9���a�v������]=H�5'�M�J�,ʠ�P��ӝ+�f^��3����h���$[�߷Q#��m�����$D.Bq���QJ�$�B�      e   I  x�u�Io�P�5�
n�70��AL�iC��dV�����J��66������@���	㲨>h�Tq�E'f��S�W7M���~�@��æ%�m$^� 64\fx-v墔���谅�`<ˊ�va\wH�8�x%U@*8��3�Y�hc�^�/���kk!SOsHr�*�wg�n�ܽϛ>����Fv+<o�oE�?^���ͫqH�#/0��}|op��B1�z�3�,���̽���HOAye֭�� c-���hLQ�oLtz��+��� $yd1c<C����eX��+�E�C�y��2�\%���	Y�$)�I%8򜸡i��_��4��˲?7���     