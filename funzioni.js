let saldo = 100;
const saldoDisplay = document.createElement('div');
saldoDisplay.id = 'saldo';
saldoDisplay.style.fontSize = '24px';
saldoDisplay.style.marginBottom = '20px';
saldoDisplay.style.color = 'white';

document.addEventListener('DOMContentLoaded', () => {
  const scommesse = document.getElementById('scommesse');
  scommesse.parentNode.insertBefore(saldoDisplay, scommesse);
  aggiornaSaldo();

  document.querySelectorAll('#scommesse li').forEach(li => {
    const info = li.querySelector('.info');
    const inputPuntata = li.querySelector('.puntata');
    const buttons = li.querySelectorAll('button');

    // Funzione per abilitare/disabilitare bottoni in base al saldo e valore puntata
    function aggiornaBottoni() {
      const puntataVal = parseFloat(inputPuntata.value);
      buttons.forEach(btn => {
        if (isNaN(puntataVal) || puntataVal < 1 || puntataVal > saldo) {
          btn.classList.add('disabled');
          btn.disabled = true;
        } else {
          btn.classList.remove('disabled');
          btn.disabled = false;
        }
      });
    }

    // Aggiorna bottoni al cambio valore input
    inputPuntata.addEventListener('input', aggiornaBottoni);
    aggiornaBottoni();

    buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const puntataVal = parseFloat(inputPuntata.value);
    if (isNaN(puntataVal) || puntataVal < 1) {
      alert('Inserisci una puntata valida (min 1€)');
      return;
    }
    if (puntataVal > saldo) {
      alert('Saldo insufficiente per questa puntata');
      return;
    }

    const quota = parseFloat(btn.dataset.quote);
    const scelta = btn.dataset.scelta.toUpperCase();

    // Togli la puntata dal saldo
    saldo -= puntataVal;
    
    // Calcola probabilità di vincita inversamente proporzionale alla quota
    // Nota: con quote molto basse questa probabilità è >1, quindi la limitiamo a 1
    let probVincita = 1 / quota;
    if(probVincita > 1) probVincita = 1;

    // Genera un numero casuale tra 0 e 1
    const random = Math.random();

    let messaggio;

    if(random <= probVincita){
      // Hai vinto!
      const vincita = puntataVal * quota;
      saldo += vincita;
      messaggio = `Complimenti! Hai vinto ${vincita.toFixed(2)}€. Nuovo saldo: ${saldo.toFixed(2)}€.`;
    } else {
      // Hai perso
      messaggio = `Peccato! Hai perso ${puntataVal.toFixed(2)}€. Saldo attuale: ${saldo.toFixed(2)}€.`;
    }

    aggiornaSaldo();
    info.textContent = messaggio;
    aggiornaBottoni();
  });
});
  });
});

function aggiornaSaldo() {
  saldoDisplay.textContent = `Saldo: ${saldo.toFixed(2)}€`;
}