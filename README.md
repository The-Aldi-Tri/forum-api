# Forum Api

Proyek ini adalah submission pertama pada course **Menjadi Back-End Developer Expert dengan JavaScript** pada learning path **Back-End Developer** di [Dicoding](dicoding.com).

Hasil Submission:

- Rating: &starf;&starf;&starf;&starf;&starf;
- Saran:

  - 1728375181045_create-table-threads.js

    ```js
    /* eslint-disable camelcase */

    /*Hapus penggunaan disable linter yang tidak pernah digunakan.*/

    exports.up = (pgm) => {
      pgm.createTable('threads', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
    ```

  - GetThreadUseCase.js

    ```js
    const commentsWithReplies = await Promise.all(
      /*
      Kamu dapat membuat sebuah entity untuk melakukan mapping data sesuai dengan proses bisnis nya (misal untuk comment/reply ada perubahan konten jika data sudah dihapus), agar usecase jadi lebih rapi dan lebih sesuai dengan tanggung jawabnya sebagai orchestrator.
      */

      comments.map(async (comment) => {
        const modifiedComment = { ...comment };
        modifiedComment.content = modifiedComment.is_deleted
          ? "**komentar telah dihapus**"
          : modifiedComment.content;
        delete modifiedComment.is_deleted;

        const replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        );
        const modifiedReplies = replies.map((reply) => {
          const modifiedReply = { ...reply };
          modifiedReply.content = modifiedReply.is_deleted
            ? "**balasan telah dihapus**"
            : modifiedReply.content;
          delete modifiedReply.is_deleted;
          return new ReplyDetails(modifiedReply);
        });

        modifiedComment.replies = modifiedReplies;
        return new CommentDetails(modifiedComment);
      })
    );
    ```

  - AddThreadUseCase.test.js

    ```js
    mockThreadRepository.addThread = jest

    /*
    Untuk melakukan mock implementasi dari fungsi, sebenarnya bisa dilakukan langsung dengan cara seperti ini:

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(
      {
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      }
    ))
    */

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(
    {
            id: 'thread-123',
            title: useCasePayload.title,
            owner: useCasePayload.owner,
    }
    ));
          .fn()
          .mockImplementation(() => Promise.resolve({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: useCasePayload.owner,
          }));
    ```

  - ThreadRepositoryPostgres.test.js

    ```js
    // Assert
    expect(thread).toHaveProperty("id", "thread-123");
    expect(thread).toHaveProperty("title", "judul");
    expect(thread).toHaveProperty("body", "isi");
    expect(thread).toHaveProperty("date");

    /*
    Untuk lebih memudahkan assert field date, kamu dapat memodifikasi fungsi test helper tambah data untuk dapat melewatkan nilai ke kolom date untuk data yang akan ditambahkan dengan menggunakan nilai dari parameter, dan disini kamu dapat membandingkan nilai date dari kembalian fungsi under test dengan nilai date yang kamu lewatkan untuk menambahkan data melalui test helper.
    */

    expect(thread).toHaveProperty("username", "dicoding");
    ```

## Studi Kasus Forum API

Garuda Game (perusahaan fiktif) merupakan sebuah perusahaan paling sukses dalam menjalankan bisnis di bidang online game. Perusahaan tersebut memiliki ratusan game yang dimainkan oleh jutaan pengguna di seluruh dunia. Salah satu kunci keberhasilan Garuda Game adalah dekat dengan para pemainnya. Mereka berhasil membangun komunitas yang aktif.

Untuk menjaga kualitas layanan terhadap komunitas, Garuda Game berinisiatif untuk membangun aplikasi diskusi atau forum untuk para pemain. Dengan hadirnya platform diskusi yang resmi, para pemain akan sangat terbantu dan merasa nyaman untuk berdiskusi perihal game yang mereka mainkan. Aplikasi forum akan tersedia di platform web ataupun mobile native.

Garuda Game ingin aplikasi forum didesain secara matang. Seperti menerapkan automation testing, menerapkan clean architecture. Dengan begitu, aplikasi ini bisa terhindar dari bug, mudah beradaptasi pada perubahan teknologi, dan mudah untuk dikembangkan.

Untuk mencapai itu, Garuda Game menghadirkan talenta terbaik dalam membangun aplikasi forum. Salah satunya adalah Anda yang ditugaskan untuk membangun Back-End API guna mendukung fungsionalitas dari aplikasi Front-End.

Aplikasi forum dikembangkan secara bertahap dan saat ini diharapkan sudah memiliki fitur:

- Registrasi Pengguna;
- Login dan Logout;
- Menambahkan Thread;
- Melihat Thread;
- Menambahkan dan Menghapus Komentar pada Thread; serta
- Menambahkan dan Menghapus Balasan Komentar Thread (opsional).

## Starter Project Forum API

Authentication merupakan salah satu fitur yang harus dimiliki Forum API. Namun karena pada latihan Anda sudah membangun Auth API, jadi fitur tersebut tidak akan kami jadikan sebagai syarat atau kriteria. Anda bisa menggunakannya Auth API sebagai starter project atau mengunduhnya pada tautan yang sudah kami sediakan:

[Forum API Starter Project](https://github.com/dicodingacademy/a276-backend-expert-labs/raw/099-shared-content/shared-content/03-submission-content/01-Forum-API-V1/forum-api-starter-project.zip)

Berikut beberapa catatan yang perlu Anda ketahui mengenai starter project yang kami sediakan:

- Starter Project yang kami berikan kurang lebih sama seperti proyek Auth API pada latihan modul Clean Architecture.
- Starter Project Forum API sudah mencakup fitur:
  - Registrasi Pengguna;
  - Login;
  - Refresh Access Token; dan
  - Logout;
- Starter Project sudah memiliki pengujian yang lengkap dan menerapkan 100% Test Coverage.
- Pada starter project kami sudah sediakan berkas .env dan konfigurasi untuk melakukan pengujian database. Anda boleh menyesuaikan nilai environment variable sesuai kebutuhan Anda bila diperlukan.
- **Starter project bersifat opsional**. Bila Anda ingin mengerjakan submission dari awal, pastikan Forum API memiliki fitur yang sudah disebutkan pada poin kedua.

## Kriteria Wajib Forum API

### 1: Menambahkan Thread

API harus dapat menambahkan thread melalui route:

- Method: **POST**
- Path: **/threads**
- Body Request:
  ```ts
  {
      "title": string,
      "body": string
  }
  ```

Response yang harus dikembalikan:

- Status Code: **201**
- Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "addedThread": {
        "id": "thread-h_W1Plfpj0TY7wyT2PUPX",
        "title": "sebuah thread",
        "owner": "user-DWrT3pXe1hccYkV1eIAxS"
      }
    }
  }
  ```

Ketentuan:

- Menambahkan **thread** merupakan _resource_ yang dibatasi (_restrict_). Untuk mengaksesnya membutuhkan _access token_ guna mengetahui siapa yang membuat _thread_.
- Jika properti _body request_ tidak lengkap atau tidak sesuai, maka:
  - Kembalikan dengan status code **400**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.

### 2: Menambahkan Komentar pada Thread

API harus dapat menambahkan komentar pada thread melalui route:

- Method: **POST**
- Path: /**threads/{threadId}/comments**
- Body Request:
  ```ts
  {
      "content": string
  }
  ```

Response yang harus dikembalikan:

- Status Code: **201**
- Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "addedComment": {
        "id": "comment-_pby2_tmXV6bcvcdev8xk",
        "content": "sebuah comment",
        "owner": "user-CrkY5iAgOdMqv36bIvys2"
      }
    }
  }
  ```

Ketentuan:

- Menambahkan **komentar** pada _thread_ merupakan _resource_ yang dibatasi (_restrict_). Untuk mengaksesnya membutuhkan _access token_ guna mengetahui siapa yang membuat komentar.
- Jika thread yang diberi komentar tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code **404**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Jika properti body request tidak lengkap atau tidak sesuai, maka:
  - Kembalikan dengan status code **400**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.

### 3: Menghapus Komentar pada Thread

API harus dapat menghapus komentar pada thread melalui route:

- Method: **DELETE**
- Path: **/threads/{threadId}/comments/{commentId}**

Response yang harus dikembalikan:

- Status Code: **200**
- Response Body:
  ```json
  {
    "status": "success"
  }
  ```

Ketentuan:

- Menghapus komentar pada thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang menghapus komentar.
- **Hanya pemilik komentar yang dapat menghapus komentar**. Bila bukan pemilik komentar, maka:
  - Kembalikan dengan status code **403**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Jika thread atau komentar yang hendak dihapus tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code **404**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Komentar dihapus secara **soft delete**, alias tidak benar-benar dihapus dari database. Anda bisa membuat dan memanfaatkan kolom seperti **is_delete** sebagai indikator apakah komentar dihapus atau tidak.

### 4: Melihat Detail Thread

API harus dapat melihat detail thread melalui route:

- Method: **GET**
- Path: **/threads/{threadId}**

Response yang harus dikembalikan:

- Status Code: **200**
- Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "thread": {
        "id": "thread-h_2FkLZhtgBKY2kh4CC02",
        "title": "sebuah thread",
        "body": "sebuah body thread",
        "date": "2021-08-08T07:19:09.775Z",
        "username": "dicoding",
        "comments": [
          {
            "id": "comment-_pby2_tmXV6bcvcdev8xk",
            "username": "johndoe",
            "date": "2021-08-08T07:22:33.555Z",
            "content": "sebuah comment"
          },
          {
            "id": "comment-yksuCoxM2s4MMrZJO-qVD",
            "username": "dicoding",
            "date": "2021-08-08T07:26:21.338Z",
            "content": "**komentar telah dihapus**"
          }
        ]
      }
    }
  }
  ```

Ketentuan:

- Mendapatkan detail thread merupakan resource terbuka. Sehingga tidak perlu melampirkan access token.
- Jika thread yang diakses tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code **404**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Wajib menampilkan seluruh komentar yang terdapat pada thread tersebut sesuai dengan contoh di atas.
- Komentar yang dihapus ditampilkan dengan konten **komentar telah dihapus**.
- Komentar diurutkan secara ascending (dari kecil ke besar) berdasarkan waktu berkomentar.

### 5: Menerapkan Automation Testing

Proyek Forum API wajib menerapkan automation testing dengan kriteria berikut:

- **Unit Testing**:
  - Wajib menerapkan Unit Testing pada bisnis logika yang ada. Baik di Entities ataupun di Use Case.
- **Integration Test**:
  - Wajib menerapkan Integration Test dalam menguji interaksi database dengan Repository.

### 6: Menerapkan Clean Architecture

Proyek Forum API wajib menerapkan Clean Architecture. Di mana source code terdiri dari 4 layer yaitu:

- **Entities** (jika dibutuhkan)
  - Tempat penyimpanan data entitas bisnis utama. Jika suatu bisnis butuh mengelola struktur data yang kompleks, maka buatlah entities.
- **Use Case**:
  - Di gunakan sebagai tempat menuliskannya flow atau alur bisnis logika.
- **Interface Adapter** (Repository dan Handler)
  - Mediator atau penghubung antara layer framework dengan layer use case.
- **Frameworks** (Database dan HTTP server)
  - Level paling luar merupakan bagian yang berhubungan dengan framework.

## Kriteria Opsional Forum API

### 1: Menambahkan Balasan pada Komentar Thread

API harus dapat menambahkan balasan pada komentar thread melalui route:

- Method: **POST**
- Path: **/threads/{threadId}/comments/{commentId}/replies**
- Body Request:
  ```ts
  {
      "content": string
  }
  ```

Response yang harus dikembalikan:

- Status Code: **201**
- Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "addedReply": {
        "id": "reply-BErOXUSefjwWGW1Z10Ihk",
        "content": "sebuah balasan",
        "owner": "user-CrkY5iAgOdMqv36bIvys2"
      }
    }
  }
  ```

Ketentuan:

- Menambahkan **balasan** pada komentar thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang membuat balasan komentar.
- Jika thread atau komentar yang diberi balasan tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code **404**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Jika properti body request tidak lengkap atau tidak sesuai, maka:
  - Kembalikan dengan status code **400**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Balasan pada komentar thread harus ditampilkan pada setiap item comments ketika mengakses detail thread. Contohnya seperti ini:

  ```json
  {
    "status": "success",
    "data": {
      "thread": {
        "id": "thread-AqVg2b9JyQXR6wSQ2TmH4",
        "title": "sebuah thread",
        "body": "sebuah body thread",
        "date": "2021-08-08T07:59:16.198Z",
        "username": "dicoding",
        "comments": [
          {
            "id": "comment-q_0uToswNf6i24RDYZJI3",
            "username": "dicoding",
            "date": "2021-08-08T07:59:18.982Z",
            "replies": [
              {
                "id": "reply-BErOXUSefjwWGW1Z10Ihk",
                "content": "**balasan telah dihapus**",
                "date": "2021-08-08T07:59:48.766Z",
                "username": "johndoe"
              },
              {
                "id": "reply-xNBtm9HPR-492AeiimpfN",
                "content": "sebuah balasan",
                "date": "2021-08-08T08:07:01.522Z",
                "username": "dicoding"
              }
            ],
            "content": "sebuah comment"
          }
        ]
      }
    }
  }
  ```

- Balasan yang dihapus ditampilkan dengan konten **balasan telah dihapus**.
- Balasan diurutkan secara ascending (dari kecil ke besar) berdasarkan waktu berkomentar.

### 2: Menghapus Balasan pada Komentar Thread

API harus dapat menghapus balasan pada komentar thread melalui route:

- Method: **DELETE**
- Path: **/threads/{threadId}/comments/{commentId}/replies/{replyId}**

Response yang harus dikembalikan:

- Status Code: **200**
- Response Body:
  ```json
  {
    "status": "success"
  }
  ```

Ketentuan:

- Menghapus **balasan** pada komentar thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang menghapus balasan.
- **Hanya pemilik balasan yang dapat menghapus balasan**. Bila bukan pemilik balasan, maka:
  - Kembalikan dengan status code **403**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Jika thread, komentar, atau balasan yang hendak dihapus tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code **404**; serta
  - Berikan body response:
    - **status**: “fail”
    - **message**: Pesan apapun selama tidak kosong.
- Balasan dihapus secara **soft delete**, alias tidak benar-benar dihapus dari database. Anda bisa membuat dan memanfaatkan kolom seperti is_delete sebagai indikator apakah komentar dihapus atau tidak.

## Pengujan API

[Forum API V1 Postman Collection + Environment Test](https://github.com/dicodingacademy/a276-backend-expert-labs/raw/099-shared-content/shared-content/03-submission-content/01-Forum-API-V1/Forum%20API%20V1%20Test.zip)

### Cara Import Collection dan Environment Forum API

- Silakan unduh tautan yang diberikan di atas.
- Ekstrak berkas yang sudah diunduh hingga menghasilkan dua berkas file JSON.
- Kemudian **import** kedua berkas tersebut pada Postman. Caranya, buka aplikasi Postman, klik tombol Import yang berada di atas panel kiri aplikasi Postman.
- Kemudian klik tombol **Upload Files** untuk meng-import kedua berkas JSON hasil ekstraksi.
- Pilih kedua berkas JSON hasil ekstraksi dan klik tombol Open.
- Kemudian klik **Import**.
- Setelah itu, Forum API V1 Collection dan Environment akan tersedia pada Postman Anda.
- Jangan lupa untuk gunakan Environment yang sudah diimpor.

### Tips Menjalankan Pengujian Forum API

- Pastikan Anda selalu menjalankan pengujian secara berurutan. Karena beberapa request membutuhkan nilai yang didapat dari request sebelumnya. Contoh, pengujian pada folder **Authentications** membutuhkan folder **Users** untuk dijalankan. Karena untuk mendapatkan melakukan autentikasi, tentu harus ada data pengguna di database.
- Untuk menjalankan request secara berurutan sekaligus, Anda bisa memanfaatkan fitur Collection Runner.
- Kerjakanlah proyek fitur demi fitur, agar Anda mudah dalam menjalankan pengujiannya.
- Jika merasa seluruh fitur yang dibangun sudah benar namun pengujiannya selalu gagal, kemungkinan database Anda kotor dengan data pengujian yang Anda lakukan sebelum-sebelumnya, dan itu bisa menjadi salah satu penyebab pengujian selalu gagal. Solusinya, silakan hapus seluruh data (truncate) pada tabel melalui **psql**.

## Kriteria Penilaian Submission

Submission Anda akan dinilai oleh Reviewer guna menentukan kebenaran submission yang Anda kerjakan. Agar dapat melanjutkan pembelajaran, proyek Forum API harus memenuhi seluruh pengujian otomatis pada seluruh Postman Request, terkecuali request yang bertanda [optional]. Bila salah satu pengujiannya gagal, maka proyek Anda akan kami tolak.

Submission Anda akan dinilai oleh Reviewer dengan skala 1-5. Untuk mendapatkan nilai tinggi, Anda bisa menerapkan beberapa saran berikut:

- Menyelesaikan kriteria opsional, yakni fitur balasan komentar thread.
- Menerapkan functional test (Hapi server test) untuk resource thread dan comment.
- Menerapkan 100% Test Coverage.
- Menuliskan kode dengan bersih alias mematuhi style guide yang Anda tetapkan.

Berikut adalah detail penilaian submission:

- &starf; : Semua ketentuan wajib terpenuhi, namun terdapat indikasi kecurangan dalam mengerjakan submission.
- &starf;&starf; : Semua ketentuan wajib terpenuhi, namun terdapat kekurangan pada penulisan kode. Seperti tidak menerapkan modularization atau gaya penulisan tidak konsisten.
- &starf;&starf;&starf; : Semua ketentuan wajib terpenuhi, namun tidak terdapat improvisasi atau persyaratan opsional yang dipenuhi.
- &starf;&starf;&starf;&starf; : Semua ketentuan wajib terpenuhi dan menerapkan minimal dua saran di atas.
- &starf;&starf;&starf;&starf;&starf; : Semua ketentuan wajib terpenuhi dan menerapkan seluruh saran di atas.

## Penolakan Submission

Submission Anda akan Ditolak bila

- Kriteria wajib Forum API tidak terpenuhi.
- Ketentuan berkas submission tidak terpenuhi.
- Proyek yang Anda kirim tidak dapat dijalankan dengan baik (Reviewer menggunakan Node.js versi LTS 14.17.0).
- Menggunakan database selain PostgreSQL.
- Menggunakan bahasa pemrograman dan teknologi lain, selain JavaScript atau TypeScript dan Node.js.
- Menggunakan Framework Node.js selain Hapi Framework.
- Melakukan kecurangan seperti tindakan plagiasi.

## Tips Dalam Mengerjakan Submission

### 1. Jangan gunakan expected value sebagai nilai kembalian fungsi yang di-mock

Ketika melakukan testing, jangan gunakan expected value sebagai nilai kembalian fungsi yang di-mock.

Contohnya seperti ini:

**GetPreparedEngineUseCase.test.js**

```js
it("should fill fuel engine to 100 and start engine", function () {
  const expectedEngine = {
    name: "engine1",
    fuel: 100,
    start: true,
  };

  const mockEngineRepository = {};
  mockEngineRepository.getEngine = jest.fn(() => expectedEngine);

  const getPreparedEngineUseCase = new GetPreparedEngineUseCase(
    mockEngineRepository
  );

  console.log(expectedEngine);
  const engine = getPreparedEngineUseCase.execute();
  console.log(expectedEngine);

  expect(engine).toStrictEqual(expectedEngine);
});
```

**GetPreparedEngineUseCase.js**

```js
class GetPreparedEngineUseCase {
  constructor(engineRepository) {
    this.engineRepository = engineRepository;
  }

  execute() {
    let engine = this.engineRepository.getEngine();

    engine.fuel = 50;
    engine.start = false;

    return engine;
  }
}
```

Kode di atas akan menghasilkan output dari kedua **console.log()** (pada kode testing) menjadi seperti berikut:

Output pertama sebelum fungsi **getPreparedEngineUseCase.execute()** dijalankan:

```js
{
   name: 'engine1',
   fuel: 100,
   start: true
}
```

Output kedua setelah fungsi **getPreparedEngineUseCase.execute()** dijalankan:

```js
{
   name: 'engine1',
   fuel: 50,
   start: false
}
```

Bisa dilihat bahwa variable **expectedEngine** di atas berubah nilainya.

Jika diperhatikan lagi, kode use case di atas juga masih tidak sesuai dengan spesifikasi testing yang dibuat. Pada spesifikasi testing, dituliskan '_should fill fuel engine to 100 and start engine_'. Tetapi nilai **expectedEngine** malah berubah menjadi **fuel: 50** dan **start: false**.

Walaupun testing masih belum sesuai, namun ia akan tetap berhasil karena **expectedEngine** dijadikan nilai kembalian fungsi yang di-mock.

Oleh karena itu, kode testing yang benar seharusnya seperti ini:

**GetPreparedEngineUseCase.test.js**

```js
it("should fill fuel engine to 100 and should start engine", function () {
  const expectedEngine = {
    name: "engine1",
    fuel: 100,
    start: true,
  };

  const engineRepository = {};
  engineRepository.getEngine = jest.fn(() => ({
    name: "engine1",
    fuel: 0,
    start: false,
  }));

  const getPreparedEngineUseCase = new GetPreparedEngineUseCase(
    engineRepository
  );

  console.log(expectedEngine);
  const engine = getPreparedEngineUseCase.execute();
  console.log(expectedEngine);

  expect(engine).toStrictEqual(expectedEngine);
});
```

Nilai kembalian pada fungsi yang di-mock bersifat netral dan biasanya berbeda dengan expected result. Ketika test di atas dijalankan maka akan terjadi error seperti ini.
Error: expect(received).toStrictEqual(expected) // deep equality

```js
- Expected  - 2
+ Received  + 2

Object {
-   "fuel": 100,
+   "fuel": 50,
    "name": "engine1",
    "start": true,
+   "start": false,
}
```

Hal ini wajar karena kode pada use case yang dibuat memang masih salah dan dengan ini kita tahu bahwa ada bug yang terjadi pada kode yang kita buat. Jadi, kita bisa memperbaiki bug yang terjadi pada use case tersebut. Inilah salah satu kegunaan testing, yaitu mendeteksi bug sedini mungkin.

Kode use case yang benar adalah seperti berikut

**GetPreparedEngineUseCase.js**

```js
class GetPreparedEngineUseCase {
  constructor(engineRepository) {
    this.engineRepository = engineRepository;
  }

  execute() {
    let engine = this.engineRepository.getEngine();

    engine.fuel = 100;
    engine.start = true;

    return engine;
  }
}
```

### 2. Saat testing pastikan verifikasi semua fungsi yang di-mock

Ketika melakukan mock pada sebuah fungsi, pastikan fungsi tersebut sudah diverifikasi bahwa memang benar-benar dipanggil. Karena jika tidak, maka bisa saja kode yang di-test tersebut menjadi tidak valid. Contohnya seperti ini:

**AddEngineUseCase.test.js**

```js
it("should return the engine properly", async () => {
  const expectedEngine = {
    name: "Faster Speed 3000",
    manufacture: "Faster Speed Inc",
    maxFuel: 200,
  };

  const engineRepository = {};
  const manufacturerRepository = {};

  const getEngineUseCase = new GetEngineUseCase(
    engineRepository,
    manufacturerRepository
  );

  engineRepository.add = jest.fn(() => Promise.resolve());
  manufacturerRepository.verifyManufactureIsRegistered = jest.fn(() =>
    Promise.resolve()
  );

  const engine = await getEngineUseCase.execute(
    "Faster Speed 3000",
    "Faster Speed Inc",
    200
  );

  expect(engine).toStrictEqual(expectedEngine);
});
```

**AddEngineUseCase.js**

```js
class AddEngineUseCase {
  constructor(engineRepository, manufacturerRepository) {
    this.engineRepository = engineRepository;
    this.manufacturerRepository = manufacturerRepository;
  }

  async execute(name, manufacture, maxFuel) {
    await this.manufacturerRepository.verifyManufactureIsRegistered(
      manufacture
    );
    await this.engineRepository.add(name, manufacture, maxFuel);

    return {
      name,
      manufacture,
      maxFuel,
    };
  }
}
```

Test di atas akan berjalan dengan baik, tetapi jika suatu saat ada developer lain yang mengubah kode use casenya sebenarnya akan ada masalah yang muncul. Misal ada developer lain yang mengapus semua pemanggilan fungsi repository dari kode di atas, menjadi seperti ini:

**AddEngineUseCase.test.js**

```js
class AddEngineUseCase {
  constructor(engineRepository, manufacturerRepository) {
    this.engineRepository = engineRepository;
    this.manufacturerRepository = manufacturerRepository;
  }

  async execute(name, manufacture, maxFuel) {
    // kode dihapus
    // kode dihapus

    return {
      name,
      manufacture,
      maxFuel,
    };
  }
}
```

Maka test tetap lolos meskipun ada kode penting yang dihapus. Dampaknya jika program tersebut dijalankan di production akan terjadi error atau anomali yang susah ditelusuri.

Agar test tersebut dapat menjadi **‘safety net’** bagi developer lain, maka wajib memverifikasi setiap fungsi yang di-mock, contohnya seperti ini:

**AddEngineUseCase.js**

```js
it("should return the engine properly", async () => {
  const expectedEngine = {
    name: "Faster Speed 3000",
    manufacture: "Faster Speed Inc",
    maxFuel: 200,
  };

  const engineRepository = {};
  const manufacturerRepository = {};

  const getEngineUseCase = new GetEngineUseCase(
    engineRepository,
    manufacturerRepository
  );

  engineRepository.add = jest.fn(() => Promise.resolve());
  manufacturerRepository.verifyManufactureIsRegistered = jest.fn(() =>
    Promise.resolve()
  );

  const engine = await getEngineUseCase.execute(
    "Faster Speed 3000",
    "Faster Speed Inc",
    200
  );

  expect(engine).toStrictEqual(expectedEngine);
  expect(engineRepository.add).toHaveBeenCalledWith(
    "Faster Speed 3000",
    "Faster Speed Inc",
    200
  );
  expect(
    manufacturerRepository.verifyManufactureIsRegistered
  ).toHaveBeenCalledWith("Faster Speed Inc");
});
```

Anda tidak hanya bisa menggunakan fungsi **toHaveBeenCalledWith()**, tapi bisa juga menggunakan fungsi **toBeCalled()**, **toBeCalledTimes()**, dan yang lainnya.

### 3. Perlu diingat kembali bahwa use case atau entity-lah yang menjadi tempat logic disimpan

Kode di bawah memiliki business logic yang disimpan di repository dan hal ini tidak bagus karena menurut Clean Architecture, logika bisnis hanya boleh didefinisikan di dalam domain atau use case. Perhatikan kode berikut:

**EngineRepository.js**

```js
class EngineRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getEngines() {
    const result = await this.pool.query("SELECT * FROM engine");

    const engine = result.row[0];

    if (engine.speed > 1000) {
      engine.type = "Super Engine";
    } else if (engine.speed > 500) {
      engine.type = "Moderate Engine";
    } else {
      engine.type = "Light Engine";
    }

    return engine;
  }
}
```

**GetEngineUseCase.js**

```js
class GetEngineUseCase {
  constructor(engineRepository) {
    this.engineRepository = engineRepository;
  }

  async execute() {
    return await this.engineRepository.get();
  }
}
```

Jika kita menerapkan Clean Architecture maka kode yang benar untuk contoh kasus di atas adalah seperti ini:

**EngineRepository.js**

```js
class EngineRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getEngines() {
    const result = await this.pool.query("SELECT * FROM engine");

    const engine = result.row[0];

    return engine;
  }
}
```

**GetEngineUseCase.js**

```js
class GetEngineUseCase {
  constructor(engineRepository) {
    this.engineRepository = engineRepository;
  }

  async execute() {
    const engine = await this.engineRepository.get();
    if (engine.speed > 1000) {
      engine.type = "Super Engine";
    } else if (engine.speed > 500) {
      engine.type = "Moderate Engine";
    } else {
      engine.type = "Light Engine";
    }
    return engine;
  }
}
```

### 4. Ketika melakukan integration test yang bersifat perubahan (insert, update, atau delete), pastikan database atau external agency lainnya juga berubah

Kode di bawah ini adalah kode yang tidak menerapkan testing terhadap external agency. Perhatikanlah contoh berikut

**EngineRepository.test.js**

```js
describe("AddEngineRepositoryTest", () => {
  it("should return added engine correctly ", function () {
    const engine = {
      name: "Faster Speed 3000",
      manufacture: "Faster Speed Inc",
      maxFuel: 200,
    };

    const engineRepository = new EngineRepository();
    const addedEngine = engineRepository.add(engine);
    expect(addedEngine).toStrictEqual(engine);
  });
});
```

Test di atas sebenarnya sudah hampir benar, tetapi karena ini merupakan integration test, maka Anda juga perlu menguji external agency-nya pada kasus ini external agency-nya adalah database. Sehingga test yang benar adalah seperti ini:

**EngineRepository.test.js**

```js
describe("AddEngineRepositoryTest", () => {
  it("should return added engine correctly ", function () {
    const engine = {
      name: "Faster Speed 3000",
      manufacture: "Faster Speed Inc",
      maxFuel: 200,
    };

    const engineRepository = new EngineRepository();
    const addedEngine = engineRepository.add(engine);
    expect(addedEngine).toStrictEqual(engine);
  });

  it("should persist add engine", function () {
    const enginePayload = {
      name: "Faster Speed 3000",
      manufacture: "Faster Speed Inc",
      maxFuel: 200,
    };

    const engineRepository = new EngineRepository();
    engineRepository.add(enginePayload);

    const engine = EnginesTableTestHelper.findEngineByName("Faster Speed 3000");
    expect(engine).toHaveLength(1);
  });
});
```

**EnginesTableTestHelper.js**

```js
const EnginesTableTestHelper = {
  findEngineById: function (name) {
    const query = {
      text: "SELECT * FROM engines WHERE name = $1",
      values: [name],
    };
    const result = pool.query(query);
    return result.rows[0];
  },
};
```

Pada test di atas kita membuat object baru bernama **EnginesTableTestHelper** yang berfungsi untuk membantu jalannya testing. Dengan fungsi yang ada di dalam object tersebut, kita bisa mengambil data yang ada di dalam database dan menggunakan data tersebut sebagai validasi testing.

### 5. Lakukan autentikasi di level interface

Jika sewaktu-waktu aplikasi back-end yang kita buat ini menjadi aplikasi lain, contohnya aplikasi terminal/cmd (CLI), maka apabila autentikasi berada pada level use case, use case tersebut jadi tidak bisa digunakan kembali karena bisa saja cara autentikasinya berbeda. Contoh kode autentikasi yang benar adalah seperti berikut

**handler.js**

```js
addEngineHandler(request){
   const { id: userId } = request.auth.credentials

   AddEngineUseCase.execute(userId, request.payload)
}
```

**AddEngineUseCase.js**

```js
execute(userId, useCasePayload) {
  engineRepository.addEngine(userId, useCasePayload)
}
```
