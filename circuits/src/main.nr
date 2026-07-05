fn main(
    age_threshold: pub Field,
    token_threshold: pub Field,
    user_address: pub Field,
    age: Field,
    token_balance: Field,
) {
    let age_num = age as u64;
    let age_t = age_threshold as u64;
    assert(age_num >= age_t);

    let bal_num = token_balance as u64;
    let bal_t = token_threshold as u64;
    assert(bal_num >= bal_t);

    assert(user_address != 0);
}
