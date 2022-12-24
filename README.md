# 🤚 Hi , TravelKKaebi 입니다!

### 🧑‍💻 프로젝트 소개
1인 가구의 증가에 따라 혼자 생활하는것이 익숙해지지만, 아직 혼자 여행을 가기에는 두려운(?) 그런 분들을 위해 서로의 여행 이야기 또는 고민들을 나누며
즐거운 여행을 할 수 있도록 도와주는 여행 커뮤니티입니다.

### ⌛️ 개발 기간
* 2022.08.17 ~ 2022.09.16

### 🔨 개발 환경(BackEnd)
* Java 11 & Spring
* Spring Boot
* Spring Data Jpa
* Spring Security
* MySQL
* React
* Amazon S3

## **`메인화면`** ##
<img src="/image/main.png" width="300" height="300">


## **`로그인 및 회원가입`** ##
<div style="display:flex;justify-content:space-around;">
  <img src="/image/login.png" width="300" height="300">
  <img src="/image/register.png" width="300" height="300">
</div>

## **`같이 가요 화면`** ##
<div style="display:flex;justify-content:space-around;">
  <img src="/image/together.png" width="300" height="300">
  <img src="/image/together1.png" width="300" height="300">
  <img src="/image/together2.png" width="300" height="300">
</div>


- ### Spring Security Config

  > Spring Security를 사용하기 위해서 Config파일을 작성하여 필요한 메서드들을 오버라이드를 해주어야 합니다.

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // web.xml 대신 HttpSecurity  를 이용한 관련 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authz) -> authz
                        .anyRequest().authenticated()
                )
                .httpBasic().disable()
                .csrf().disable()
                .cors()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Jwt filter 등록
        // 매 요청마다 jwtAuthenticationFilter 실행
        http.addFilterAfter(jwtAuthenticationFilter, CorsFilter.class);
        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().antMatchers("/", "/**");
    }

}
```


- ### 회원관련 엔티티 ORM 구현

```java
@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class UserEntity extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int id;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "blocked_until", nullable = false)
    private LocalDateTime blockedUntil;

    @Column(name = "manner_degree", nullable = false)
    private int mannerDegree;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean blocked = false;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public void change(UserUpdateDTO userUpdateDTO) {
        this.email = userUpdateDTO.getEmail();
        this.password = Password.passwordEncoding(userUpdateDTO.getPassword());
        this.profileImageUrl = userUpdateDTO.getProfileImageUrl();
        this.phone = userUpdateDTO.getPhone();
        this.nickname = userUpdateDTO.getNickname();
    }

}
```

- ### Controller 구현

```java
@CrossOrigin
@RestController
@RequestMapping("/travelkkaebi")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AwsS3service awsS3service;

    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(
            @RequestPart(value = "file", required = false) MultipartFile image,
            @RequestPart(value = "userDTO") @Valid UserDTO userDTO) throws IOException {
        userService.register(userDTO, awsS3service.upload(image, "static"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/username/check")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        System.out.println(username);
        return ResponseEntity.ok().body(userService.usernameCheck(username));
    }

    @GetMapping("/nickname/check")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        System.out.println(nickname);
        return ResponseEntity.ok().body(userService.nicknameCheck(nickname));
    }

    @PostMapping("/signin")
    public ResponseEntity<LogInDTO> auth(@RequestBody LogInDTO logInDTO) {
        return ResponseEntity.ok().body(userService.auth(logInDTO.getUsername(), logInDTO.getPassword()));
    }

    @PutMapping("/update")
    public ResponseEntity<Void> userUpdate(
            @AuthenticationPrincipal String userId,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart UserUpdateDTO userUpdateDTO) throws IOException {
        userService.update(Integer.parseInt(userId), userUpdateDTO, awsS3service.upload(image, "static"));
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/delete")
    public ResponseEntity<Void> userDelete(@AuthenticationPrincipal String userId, @RequestBody DeleteUserDTO deleteUserDTO) {
        userService.delete(Integer.parseInt(userId), deleteUserDTO);
        return ResponseEntity.ok().build();
    }

}
```

- ### Service 구현

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userDB;
    private final TokenProvider tokenProvider;

    @Transactional
    public void register(UserDTO userDTO, String uploadImageUrl) {
        //username 및 email 중복체크 method
        validate(userDTO.getUsername(), userDTO.getEmail());

        //dto, imageUrl -> entity 변환후 DB save
        UserEntity userEntity = UserDTO.toUserEntity(userDTO);
        userEntity.setProfileImageUrl(uploadImageUrl);

        userDB.save(userEntity);
    }

    public boolean usernameCheck(String username) {
        return userDB.existsByUsername(username);
    }

    private boolean emailCheck(String email) {
        return userDB.existsByEmail(email);
    }

    public boolean nicknameCheck(String nickname) {
        return userDB.existsByNickname(nickname);
    }

    private void validate(String username, String email) {
        if (usernameCheck(username) || emailCheck(email))
            throw new KkaebiException(ALREADY_EXIST_USERNAME);
    }

    public LogInDTO auth(String username, String password) {
        UserEntity findUser = userDB.findByUsername(username)
                .orElseThrow(() -> new KkaebiException(DOES_NOT_EXIST_USER));
        //password 일치 check
        if (Password.passwordMatch(password, findUser.getPassword())) {
            // create token
            String token = tokenProvider.create(findUser);
            //발급된 토큰및 entity -> dto 변환후 함께 리턴
            return LogInDTO.toDto(findUser, token);
        }
        return null;
    }

    @Transactional
    public void update(int userId, UserUpdateDTO userUpdateDTO, String uploadImageUrl) {
        UserEntity findUser = userDB.findById(userUpdateDTO.getUserid()).orElseThrow(() -> new KkaebiException(USER_UPDATE_EXCEPTION));
        validateUserId(userId, findUser);

        userUpdateDTO.setProfileImageUrl(uploadImageUrl);
        findUser.change(userUpdateDTO);
    }

    @Transactional
    public void delete(int userId, DeleteUserDTO deleteUserDTO) {
        UserEntity deleteUser = userDB.findById(deleteUserDTO.getUserid()).orElseThrow(() -> new KkaebiException(USER_DELETE_EXCEPTION));
        validateUserId(userId, deleteUser);

        if (!Password.passwordMatch(deleteUserDTO.getPassword(), deleteUser.getPassword()))
            throw new KkaebiException(DOES_NOT_MATCH_PASSWORD);

        userDB.delete(deleteUser);
    }

    private void validateUserId(int userId, UserEntity findUser) {
        if (userId != findUser.getId())
            throw new KkaebiException(DOES_NOT_EXIST_USER);
    }

}
```
